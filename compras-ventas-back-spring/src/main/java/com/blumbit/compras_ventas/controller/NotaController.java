package com.blumbit.compras_ventas.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blumbit.compras_ventas.dto.request.NotaRequest;
import com.blumbit.compras_ventas.dto.response.NotaResponse;
import com.blumbit.compras_ventas.service.spec.INotaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notas")
@RequiredArgsConstructor
public class NotaController {

    private final INotaService notaService;

    @PostMapping
    public ResponseEntity<byte[]> createNota(@Valid @RequestBody NotaRequest notaRequest) {
        byte[] notaResponse = notaService.createNota(notaRequest);
        return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment: filename=nota-report.pdf")
        .body(notaResponse);
    }


    @GetMapping
    public ResponseEntity<List<NotaResponse>> getAllNotas() {
        List<NotaResponse> notas = notaService.getAllNotas();
        return ResponseEntity.ok(notas);
    }
}
