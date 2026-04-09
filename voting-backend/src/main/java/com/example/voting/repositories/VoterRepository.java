package com.example.voting.repositories;

import com.example.voting.models.Voter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoterRepository extends JpaRepository<Voter, String> {
}