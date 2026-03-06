package com.blumbit.compras_ventas.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.blumbit.compras_ventas.dto.request.NotaRequest;
import com.blumbit.compras_ventas.dto.request.MovimientoRequest;
import com.blumbit.compras_ventas.dto.response.NotaResponse;
import com.blumbit.compras_ventas.dto.response.MovimientoResponse;
import com.blumbit.compras_ventas.entity.Nota;
import com.blumbit.compras_ventas.entity.Movimiento;
import com.blumbit.compras_ventas.entity.Usuario;
import com.blumbit.compras_ventas.entity.ClienteProveedor;
import com.blumbit.compras_ventas.entity.Producto;
import com.blumbit.compras_ventas.entity.Almacen;
import com.blumbit.compras_ventas.entity.AlmacenProducto;
import com.blumbit.compras_ventas.enums.TipoMovimiento;
import com.blumbit.compras_ventas.repository.NotaRepository;
import com.blumbit.compras_ventas.repository.MovimientoRepository;
import com.blumbit.compras_ventas.repository.UsuarioRepository;
import com.blumbit.compras_ventas.repository.ClienteProveedorRepository;
import com.blumbit.compras_ventas.repository.ProductoRepository;
import com.blumbit.compras_ventas.repository.AlmacenProductoRepository;
import com.blumbit.compras_ventas.repository.AlmacenRepository;
import com.blumbit.compras_ventas.service.spec.INotaService;
import com.blumbit.compras_ventas.service.spec.IPdfService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotaServiceImpl implements INotaService {

    private final NotaRepository notaRepository;
    private final MovimientoRepository movimientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClienteProveedorRepository clienteProveedorRepository;
    private final ProductoRepository productoRepository;
    private final AlmacenRepository almacenRepository;
    private final AlmacenProductoRepository almacenProductoRepository;
    private final IPdfService pdfService;

    @Override
    @Transactional
    public byte[] createNota(NotaRequest notaRequest) {
        Usuario usuario = usuarioRepository.findById(notaRequest.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        ClienteProveedor clienteProveedor = clienteProveedorRepository.findById(notaRequest.getClienteProveedorId())
                .orElseThrow(() -> new RuntimeException("Cliente/Proveedor no encontrado"));

        Nota nota = NotaRequest.toEntity(notaRequest);
        nota.setUsuario(usuario);
        nota.setEstadoNota("REGISTRADO");
        nota.setClienteProveedor(clienteProveedor);

        Nota notaGuardada = notaRepository.save(nota);

        //crear movimientos
        List<Movimiento> movimientosCreated = new ArrayList<>();
        for(MovimientoRequest movimientoRequest : notaRequest.getMovimientos()) {
            movimientoRequest.setTipoMovimiento(notaGuardada.getTipoNota().equals("Compra") ? TipoMovimiento.ENTRADA.toString() : TipoMovimiento.SALIDA.toString());
            if(validStock(movimientoRequest)){
                Movimiento movimientoToCreate = MovimientoRequest.toEntity(movimientoRequest);
                movimientoToCreate.setNota(notaGuardada);
                movimientoToCreate.setTipoMovimiento(movimientoRequest.getTipoMovimiento().equals("Compra")  ? TipoMovimiento.ENTRADA : TipoMovimiento.SALIDA);
                movimientoToCreate.setProducto(productoRepository.findById(movimientoRequest.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado")));
                movimientoToCreate.setAlmacen(almacenRepository.findById(movimientoRequest.getAlmacenId())
                        .orElseThrow(() -> new RuntimeException("Almacen no encontrado")));        
                movimientosCreated.add(movimientoRepository.save(movimientoToCreate));       
            }else {
                throw new RuntimeException("Error al validar stock");
            }
        }
        //Update stock
        for(Movimiento movimiento : movimientosCreated) {
            AlmacenProducto almacenProductoRetrieved = almacenProductoRepository.findByAlmacen_IdAndProducto_Id(movimiento.getAlmacen().getId(), movimiento.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("AlmacenProducto no encontrado"));

                switch (movimiento.getTipoMovimiento()) {
                    case TipoMovimiento.ENTRADA:
                       almacenProductoRetrieved.setStock(almacenProductoRetrieved.getStock() + movimiento.getCantidad());
                        break;
                    case TipoMovimiento.SALIDA:
                        almacenProductoRetrieved.setStock(almacenProductoRetrieved.getStock() - movimiento.getCantidad());
                        break;    
                    default:
                        break;
                }
                almacenProductoRepository.save(almacenProductoRetrieved);    
        }
        //genrar reporte de notas
        Map<String, Object> data = new HashMap<>();
        data.put("nota", notaGuardada);
        data.put("movimientos", movimientosCreated);
       
        return  pdfService.generatePdfFromHtml("nota-report", data);
    }

    @Override
    public List<NotaResponse> getAllNotas() {
        return notaRepository.findAll().stream()
                .map(NotaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private boolean validStock(MovimientoRequest movimientoRequest) {
        try {
            if(movimientoRequest.getTipoMovimiento().equals(TipoMovimiento.SALIDA.toString())){
                boolean valid = movimientoRequest.getTipoMovimiento() == TipoMovimiento.SALIDA.toString()
                && movimientoRequest.getCantidad() <= almacenProductoRepository
                .findByAlmacen_IdAndProducto_Id(movimientoRequest.getAlmacenId(), movimientoRequest.getProductoId())
                .get().getStock();
            return valid;
            }
            return true;
        } catch (Exception e) {
            log.error("erro validando stock", e);
            throw new RuntimeException("Error al validar el stock: " + e.getMessage());
        }
    }
}
