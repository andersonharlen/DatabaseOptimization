-- 1. Criação dos Índices de Cobertura
CREATE INDEX IF NOT EXISTS IX_Orders_CustomerId_Status 
ON "Orders" ("CustomerId") 
INCLUDE ("Status");

CREATE INDEX IF NOT EXISTS IX_OrderItems_OrderId_Covering 
ON "OrderItems" ("OrderId") 
INCLUDE ("Quantity", "UnitPrice");

-- 2. Consulta filtrada por um escopo específico (Uso real de Index Scan)
EXPLAIN ANALYZE
SELECT 
    o."Id" AS OrderId,
    o."OrderDate",
    o."Status",
    SUM(i."Quantity" * i."UnitPrice") AS TotalItemsValue
FROM "Orders" o
JOIN "OrderItems" i ON o."Id" = i."OrderId"
WHERE o."Status" = 'Completed'
  AND o."OrderDate" >= (CURRENT_DATE - INTERVAL '180 days')
GROUP BY o."Id", o."OrderDate", o."Status"
LIMIT 50;