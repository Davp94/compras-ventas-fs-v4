package com.blumbit.compras_ventas.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.common.PageableRequest;
import com.blumbit.compras_ventas.common.PageableResponse;
import com.blumbit.compras_ventas.dto.file.FileRequest;
import com.blumbit.compras_ventas.dto.file.FileResponse;
import com.blumbit.compras_ventas.dto.request.ProductoFilterCriteria;
import com.blumbit.compras_ventas.dto.request.ProductoRequest;
import com.blumbit.compras_ventas.dto.response.ProductoResponse;
import com.blumbit.compras_ventas.entity.Producto;
import com.blumbit.compras_ventas.repository.AlmacenProductoRepository;
import com.blumbit.compras_ventas.repository.CategoriaRepository;
import com.blumbit.compras_ventas.repository.ProductoRepository;
import com.blumbit.compras_ventas.repository.specification.ProductoSpecification;
import com.blumbit.compras_ventas.service.spec.IProductoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class ProductoService implements IProductoService {

    private final ProductoRepository productoRepository;

    private final AlmacenProductoRepository almacenProductoRepository;

    private final CategoriaRepository categoriaRepository;

    private final FileService fileService;


    @Override
    public PageableResponse<ProductoResponse> getProductosPaginacion(
            PageableRequest<ProductoFilterCriteria> pageableRequest) {
        try {
             Sort sort = pageableRequest.getSortOrder().equalsIgnoreCase("asc") 
        ? Sort.by(pageableRequest.getSortField()).ascending()
        : Sort.by(pageableRequest.getSortField()).descending();

        Pageable pageable = PageRequest.of(
            pageableRequest.getPageNumber(), 
            pageableRequest.getPageSize(), 
            sort
        );

        Specification<Producto> specification = null;
        if(pageableRequest.getCriterials() !=null){
          specification = ProductoSpecification.createSpecification(pageableRequest.getCriterials(), pageableRequest.getFilterValue());
        }

        Page<Producto> productoPage = productoRepository.findAll(specification, pageable);

        return PageableResponse.<ProductoResponse>builder()
            .content(productoPage.getContent().stream().map(ProductoResponse::fromEntity).toList())
            .pageNumber(productoPage.getNumber())
            .pageSize(productoPage.getSize())
            .totalElements(productoPage.getTotalElements())
            .totalPages(productoPage.getTotalPages())
            .build();
        } catch (Exception e) {
            log.error("error exception: {}", e.getMessage(), e);
            throw new RuntimeException("Error recuperando paginated products");
        }
       
        
    }

    @Override
    public List<ProductoResponse> getProductosByAlmacen(Integer almacenId) {
       return almacenProductoRepository.findByAlmacenId(almacenId).stream()
        .map(almacenProducto -> ProductoResponse.fromEntity(almacenProducto.getProducto()))
        .toList();
    }

    @Override
    public ProductoResponse createProducto(ProductoRequest productoRequest) {
        try {
            Producto productoToCreate = ProductoRequest.toEntity(productoRequest);
            productoToCreate.setCategoria(categoriaRepository.findById(productoRequest.getCategoriaId()).orElse(null));
            FileResponse createdFile = fileService.createFile(FileRequest.builder()
                .file(productoRequest.getFile())
                .build());
            productoToCreate.setImagen(createdFile.getFilePath());    
            return ProductoResponse.fromEntity(productoRepository.save(productoToCreate));
        } catch (Exception e) {
            log.error("Error creando producto", e);
            throw e;
        }
    }



}
