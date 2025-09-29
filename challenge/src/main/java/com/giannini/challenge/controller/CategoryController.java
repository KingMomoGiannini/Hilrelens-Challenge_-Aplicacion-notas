package com.giannini.challenge.controller;

import com.giannini.challenge.DTO.CategoryDtos.Create;
import com.giannini.challenge.DTO.CategoryDtos.Response;
import com.giannini.challenge.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response create(@Valid @RequestBody Create req) {
        return service.create(req);
    }

    @GetMapping
    public List<Response> list() {
        return service.list();
    }
}
