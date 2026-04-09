package com.example.voting;

import com.example.voting.models.Candidate;
import com.example.voting.models.Voter;
import com.example.voting.repositories.CandidateRepository;
import com.example.voting.repositories.VoterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VotingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(VotingBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(CandidateRepository candidateRepo, VoterRepository voterRepo) {
        return args -> {
            candidateRepo.save(new Candidate("Bharath", "Progressive Party", 0));
            candidateRepo.save(new Candidate("Aashray", "Conservative Party", 0));
            candidateRepo.save(new Candidate("Nikhil", "Independent", 0));

            voterRepo.save(new Voter("V1001", "Vignesh", false));
            voterRepo.save(new Voter("V1002", "Nishanth", false));
            voterRepo.save(new Voter("V1003", "John", false));
            
            System.out.println("--- Database Successfully Seeded! ---");
        };
    }
}