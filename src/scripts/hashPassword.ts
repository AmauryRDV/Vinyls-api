import bcrypt from 'bcrypt';


const passwords = [
    { email: 'gerant@vinyl.com', password: 'gerant123', role: 'gerant' },
    { email: 'disquaire@vinyl.com', password: 'disquaire123', role: 'disquaire' }
];

async function hashPasswords() {
    console.log('🔐 Génération des mots de passe hashés...\n');
    
    for (const user of passwords) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Password: ${user.password}`);
        console.log(`👤 Role: ${user.role}`);
        console.log(`🔒 Hashed: ${hashedPassword}\n`);
        console.log(`MongoDB Insert:`);
        console.log(JSON.stringify({
            email: user.email,
            password: hashedPassword,
            role: user.role
        }, null, 2));
        console.log('\n' + '='.repeat(80) + '\n');
    }
    
    console.log('✅ Vous pouvez maintenant copier-coller ces objets dans MongoDB Compass');
}

hashPasswords().catch(console.error);
