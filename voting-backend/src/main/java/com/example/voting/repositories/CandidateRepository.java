package com.example.voting.repositories;

import com.example.voting.models.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByNameContainingIgnoreCase(String name);
}