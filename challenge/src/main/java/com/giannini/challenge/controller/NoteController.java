package com.giannini.challenge.controller;

import com.giannini.challenge.DTO.NoteDtos.Create;
import com.giannini.challenge.DTO.NoteDtos.Update;
import com.giannini.challenge.DTO.NoteDtos.Response;
import com.giannini.challenge.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService service;

    @GetMapping
    public List<Response> list(@RequestParam(defaultValue = "false") boolean archived,
                               @RequestParam Optional<String> category) {
        return service.list(archived, category);
    }

    @GetMapping("/{id}")
    public Response get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response create(@Valid @RequestBody Create req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Response update(@PathVariable Long id, @Valid @RequestBody Update req) {
        return service.update(id, req);
    }

    @PatchMapping("/{id}/archive")
    public Response archive(@PathVariable Long id) {
        return service.archive(id);
    }

    @PatchMapping("/{id}/unarchive")
    public Response unarchive(@PathVariable Long id) {
        return service.unarchive(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/categories/{categoryId}")
    public Response addCategory(@PathVariable Long id, @PathVariable Long categoryId) {
        return service.addCategory(id, categoryId);
    }

    @DeleteMapping("/{id}/categories/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeCategory(@PathVariable Long id, @PathVariable Long categoryId) {
        service.removeCategory(id, categoryId);
    }
}
