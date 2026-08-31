using DatabaseOptimization.Domain;
using System;
using System.Threading.Tasks;

namespace DatabaseOptimization.ConsoleApp;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("Iniciando otimização de banco de dados...");

        using var context = new AppDbContext();
        
        Console.WriteLine("Garantindo que o banco existe no Docker...");
        await context.Database.EnsureCreatedAsync();

        var seeder = new DatabaseSeeder(context);
        
        // Gera 5.000 clientes e 40 pedidos para cada (Total = 200.000 pedidos e 600.000 itens)
        await seeder.SeedAsync(5000, 40); 

        Console.WriteLine("Processo finalizado. O banco está populado e pronto para os testes de query.");
    }
}