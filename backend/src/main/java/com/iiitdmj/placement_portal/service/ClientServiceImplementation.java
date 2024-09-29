package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.entity.Client;
import com.iiitdmj.placement_portal.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientServiceImplementation implements ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client getClientById(Integer id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
    }

    @Override
    public Client addClient(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public Client updateClient(Client client, Integer id) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));

        existingClient.setEmail(client.getEmail());
        existingClient.setFirstName(client.getFirstName());
        existingClient.setLastName(client.getLastName());
        existingClient.setDescription(client.getDescription());
        existingClient.setLinkedinUrl(client.getLinkedinUrl());
        existingClient.setCompany(client.getCompany());
        existingClient.setPosition(client.getPosition());
        existingClient.setMobileNumbers(client.getMobileNumbers());

        return clientRepository.save(existingClient);
    }

    @Override
    public void deleteClient(Integer id) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
        clientRepository.delete(existingClient);
    }
}
