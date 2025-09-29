package com.giannini.challenge.service;

import com.giannini.challenge.DTO.NoteDtos.Create;
import com.giannini.challenge.DTO.NoteDtos.Update;
import com.giannini.challenge.DTO.NoteDtos.Response;
import com.giannini.challenge.exception.NotFoundException;
import com.giannini.challenge.model.Category;
import com.giannini.challenge.model.Note;
import com.giannini.challenge.repository.INoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class NoteService {

    private final INoteRepository repo;
    private final CategoryService categoryService;

    public Response create(Create req) {
        Note note = Note.builder()
                .title(req.title())
                .content(req.content())
                .archived(false)
                .build();
        return toDto(repo.save(note));
    }

    @Transactional(readOnly = true)
    public List<Response> list(boolean archived, Optional<String> category) {
        List<Note> notes = category.filter(s -> !s.isBlank())
                .map(String::trim)
                .map(name -> repo.findDistinctByArchivedAndCategories_NameIgnoreCase(archived, name))
                .orElseGet(() -> repo.findByArchived(archived));
        return notes.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Response get(Long id) {
        return toDto(getEntity(id));
    }

    public Response update(Long id, Update req) {
        Note n = getEntity(id);
        if (req.title() != null)   n.setTitle(req.title());
        if (req.content() != null) n.setContent(req.content());
        return toDto(n);
    }

    public Response archive(Long id) {
        Note n = getEntity(id);
        n.setArchived(true);
        return toDto(n);
    }

    public Response unarchive(Long id) {
        Note n = getEntity(id);
        n.setArchived(false);
        return toDto(n);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NotFoundException("Note %d not found".formatted(id));
        repo.deleteById(id);
    }

    // --- Fase 2: add/remove categoría en una nota ---
    public Response addCategory(Long noteId, Long categoryId) {
        Note n = getEntity(noteId);
        Category c = categoryService.getEntity(categoryId);
        n.getCategories().add(c); // Set evita duplicados
        return toDto(n);
    }

    public Response removeCategory(Long noteId, Long categoryId) {
        Note n = getEntity(noteId);
        Category c = categoryService.getEntity(categoryId);
        n.getCategories().remove(c);
        return toDto(n);
    }

    // --- helpers ---
    private Note getEntity(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Note %d not found".formatted(id)));
    }

    private Response toDto(Note n) {
        var categories = n.getCategories().stream()
                .map(Category::getName)
                .sorted(Comparator.naturalOrder())
                .toList();

        return new Response(
                n.getId(), n.getTitle(), n.getContent(), n.isArchived(),
                categories, n.getCreatedAt(), n.getUpdatedAt()
        );
    }
}
