package com.giannini.challenge.service;

import com.giannini.challenge.DTO.CategoryDtos.Create;
import com.giannini.challenge.DTO.CategoryDtos.Response;
import com.giannini.challenge.model.Category;
import com.giannini.challenge.repository.ICategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final ICategoryRepository repo;

    public Response create(Create req) {
        String normalized = req.name().trim();
        // Si ya existe (case-insensitive), devolvemos la existente (evita 409 para el challenge)
        Category cat = repo.findByNameIgnoreCase(normalized)
                .orElseGet(() -> repo.save(Category.builder().name(normalized).build()));
        return new Response(cat.getId(), cat.getName());
    }

    @Transactional(readOnly = true)
    public List<Response> list() {
        return repo.findAll().stream()
                .map(c -> new Response(c.getId(), c.getName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public Category getEntity(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Category %d not found".formatted(id)));
    }
}
