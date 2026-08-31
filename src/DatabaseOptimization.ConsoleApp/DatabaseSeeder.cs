using System;
using System.Threading.Tasks;
using Bogus;
using DatabaseOptimization.Domain;
using Microsoft.EntityFrameworkCore;

namespace DatabaseOptimization.ConsoleApp;

public class DatabaseSeeder
{
    private readonly AppDbContext _context;

    public DatabaseSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync(int customerCount = 5000, int ordersPerCustomer = 40)
    {
        // Verifica se já existem clientes para evitar duplicar a carga à toa
        if (await _context.Customers.AnyAsync())
        {
            Console.WriteLine("O banco de dados já possui dados. Pulando o processo de Seed.");
            return;
        }

        Console.WriteLine($"Iniciando a geração de massa de dados ({customerCount} clientes x {ordersPerCustomer} pedidos)...");

        // 1. Gera os Clientes
        var customerFaker = new Faker<Customer>()
            .RuleFor(c => c.Id, f => Guid.NewGuid())
            .RuleFor(c => c.Name, f => f.Name.FullName())
            .RuleFor(c => c.Email, f => f.Internet.Email())
            .RuleFor(c => c.CreatedAt, f => f.Date.Past(2).ToUniversalTime()); // <--- .ToUniversalTime()

        var customers = customerFaker.Generate(customerCount);
        await _context.Customers.AddRangeAsync(customers);
        await _context.SaveChangesAsync();
        Console.WriteLine("Clientes inseridos com sucesso.");

        // 2. Gera os Pedidos e Itens em lotes para otimizar memória
        int batchCount = 0;
        foreach (var customer in customers)
        {
            var orders = new Faker<Order>()
                .RuleFor(o => o.Id, f => Guid.NewGuid())
                .RuleFor(o => o.CustomerId, f => customer.Id)
                .RuleFor(o => o.OrderDate, f => f.Date.Recent(730).ToUniversalTime()) // <--- .ToUniversalTime()
                .RuleFor(o => o.Status, f => f.PickRandom("Completed", "Pending", "Cancelled"))
                .RuleFor(o => o.TotalAmount, f => f.Finance.Amount(50, 3000))
                .Generate(ordersPerCustomer);

            foreach (var order in orders)
            {
                var items = new Faker<OrderItem>()
                    .RuleFor(i => i.Id, f => Guid.NewGuid())
                    .RuleFor(i => i.OrderId, f => order.Id)
                    .RuleFor(i => i.ProductName, f => f.Commerce.ProductName())
                    .RuleFor(i => i.Quantity, f => f.Random.Int(1, 5))
                    .RuleFor(i => i.UnitPrice, f => f.Finance.Amount(10, 600))
                    .Generate(3); // 3 itens por pedido

                order.Items = items;
            }

            await _context.Orders.AddRangeAsync(orders);
            batchCount++;

            // Salva a cada 100 clientes para não estourar a memória RAM
            if (batchCount % 100 == 0)
            {
                await _context.SaveChangesAsync();
                Console.WriteLine($"{batchCount * ordersPerCustomer} pedidos gerados e salvos...");
            }
        }

        // Salva o restante pendente
        await _context.SaveChangesAsync();
        Console.WriteLine("Massa de dados gerada com sucesso! Carga pesada concluída.");
    }
}