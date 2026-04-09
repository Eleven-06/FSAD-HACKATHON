package com.example.voting.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Voter {
    @Id
    private String voterId;
    private String name;
    private boolean hasVoted;

    public Voter() {}
    public Voter(String voterId, String name, boolean hasVoted) {
        this.voterId = voterId; this.name = name; this.hasVoted = hasVoted;
    }

    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isHasVoted() { return hasVoted; }
    public void setHasVoted(boolean hasVoted) { this.hasVoted = hasVoted; }
}