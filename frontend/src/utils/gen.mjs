import fs from "fs"; // Import the file system module
import companies from "./Companies.json" assert { type: "json" };

function getRandomRoles(rolesPool, numRoles) {
    // Function to get a random subset of roles
    let shuffled = rolesPool.sort(() => 0.5 - Math.random());
    if (numRoles < 1) numRoles = 1;
    return shuffled.slice(0, numRoles);  // Return a random number of roles
}

function assignRoles() {
    const rolesPool = [
        'Software Developer',
        'Data Analyst',
        'Business Analyst',
        'Associate Software Engineer',
        'Product Manager',
        'UI/UX Designer',
        'DevOps Engineer'
    ];

    // Assigning random roles to each company
    companies.forEach(company => {
        const numRoles = Math.floor(Math.random() * rolesPool.length) + 1;  // Random number of roles
        company.roles = getRandomRoles(rolesPool, numRoles % 4);  // Assign random roles array
    });

    // Write the updated companies back into the Companies.json file
    fs.writeFileSync('./Companies.json', JSON.stringify(companies, null, 2), 'utf8');
}

// Call the function
assignRoles();
