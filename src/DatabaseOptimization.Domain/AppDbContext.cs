using Microsoft.EntityFrameworkCore;

namespace DatabaseOptimization.Domain;

public class AppDbContext : DbContext
{
    // Construtor que aceita as opções injetadas pela API ou Console
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // (Opcional) Construtor vazio caso precise instanciar com 'new AppDbContext()' sem parâmetros
    public AppDbContext()
    {
    }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Se já não estiver configurado (útil caso rode o console direto sem passar builder)
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=performance_db;Username=postgres;Password=password123");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Customer)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CustomerId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(i => i.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.OrderId);
    }
}