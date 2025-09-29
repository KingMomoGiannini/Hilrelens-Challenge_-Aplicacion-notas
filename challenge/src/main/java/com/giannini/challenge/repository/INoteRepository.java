package com.giannini.challenge.repository;

import com.giannini.challenge.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByArchived(boolean archived);
    List<Note> findDistinctByArchivedAndCategories_NameIgnoreCase(boolean archived, String categoryName);
}
