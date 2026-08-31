-- Relatório pesado sem filtro de data para forçar varredura completa na massa de dados
EXPLAIN ANALYZE
SELECT
    c."Name",
    o."Status",
    COUNT(o."Id") AS TotalOrders,
    SUM(i."Quantity" * i."UnitPrice") AS TotalRevenue
FROM "Customers" c
JOIN "Orders" o ON c."Id" = o."CustomerId"
JOIN "OrderItems" i ON o."Id" = i."OrderId"
GROUP BY c."Name", o."Status"
ORDER BY TotalRevenue DESC;