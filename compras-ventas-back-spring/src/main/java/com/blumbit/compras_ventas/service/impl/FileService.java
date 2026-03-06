package com.blumbit.compras_ventas.service.impl;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.blumbit.compras_ventas.dto.file.FileDownloadResponse;
import com.blumbit.compras_ventas.dto.file.FileRequest;
import com.blumbit.compras_ventas.dto.file.FileResponse;
import com.blumbit.compras_ventas.service.spec.IFileService;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FileService implements IFileService{

    @Value("${storage.location}")
    private String filePath;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        try {
            this.fileStorageLocation = Paths.get(filePath).toAbsolutePath().normalize();
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception e) {
            throw new RuntimeException("No se puede crear el directorio para guardar los archivos.", e);
        }
    }

    @Override
    public FileResponse createFile(FileRequest fileRequest) {
        MultipartFile file = fileRequest.getFile();
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        try {
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);
            return FileResponse.builder().filePath(fileName).build();
        } catch (Exception e) {
            log.error("Error al crear archivo", e);
            throw new RuntimeException("Error al crear el archivo", e);
        }
    }

    @Override
    public File retrieveFile(FileResponse fileResponse) {
        try {
            Path filePath = fileStorageLocation.resolve(fileResponse.getFilePath()).normalize();
            if(!filePath.startsWith(fileStorageLocation)) {
                throw new RuntimeException("Ruta de archivo no válida");
            }
            File file = filePath.toFile();
            if(!file.exists()) {
                throw new RuntimeException("Archivo no encontrado");
            }
            return file;
        } catch (Exception e) {
            throw new RuntimeException("Error recuperando el archivo");
        }
    }

    @Override
    public FileDownloadResponse fileDownload(String filePath) {
        try {
            FileResponse fileResponse = FileResponse.builder().filePath(filePath).build();
            File file = retrieveFile(fileResponse);
            Path path = Paths.get(file.getAbsolutePath());
            Resource resource = new UrlResource(path.toUri());
            if(!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Archivo no encontrado o no legible");
            }
            String contentType = "";
            try {
                contentType = Files.probeContentType(path);
            } catch (Exception e) {
                log.warn("No se pudo determinar el tipo de contenido, se usará application/octet-stream");
                contentType = "application/octet-stream";
            }
            return FileDownloadResponse.builder()
                    .fileName(file.getName())
                    .contentType(contentType)
                    .resource(resource)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        if(originalFileName == null) {
            originalFileName = "file";
        }
        String timestamp = new SimpleDateFormat("ddMMyyyy_HHmmss").format(new Date());
        String uuid = UUID.randomUUID().toString().substring(0, 8);

        return timestamp + "_" + uuid + "_" + originalFileName;
    }

}
