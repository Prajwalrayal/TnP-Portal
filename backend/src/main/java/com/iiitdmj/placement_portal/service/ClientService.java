package com.iiitdmj.placement_portal.service;

import com.iiitdmj.placement_portal.entity.Client;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClientService {
    List<Client> getAllClients();
    Client getClientById(Integer id);
    Client addClient(Client client);
    Client updateClient(Client client, Integer id);
    void deleteClient(Integer id);
}
