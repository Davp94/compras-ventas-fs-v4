package com.blumbit.compras_ventas.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blumbit.compras_ventas.dto.file.FileDownloadResponse;
import com.blumbit.compras_ventas.dto.file.FileRequest;
import com.blumbit.compras_ventas.dto.file.FileResponse;
import com.blumbit.compras_ventas.service.spec.IFileService;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final IFileService fileService;

    @PostMapping
    public ResponseEntity<FileResponse> uploadFile(@ModelAttribute FileRequest fileRequest) {
        return ResponseEntity.ok(fileService.createFile(fileRequest));
    }

    @GetMapping
    public ResponseEntity<Resource> retrieveFile(@RequestParam String filePath) {
        FileDownloadResponse downloadResponse = fileService.fileDownload(filePath);
        return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(downloadResponse.getContentType()))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment: filename="+downloadResponse.getFileName())
        .body(downloadResponse.getResource());
    }
    
    
}
