// Exemple d'endpoint API pour l'application mobile
// À implémenter dans le backend de l'application mobile

// GET /api/sales/mobile
// Retourne les ventes de la journée
app.get('/api/sales/mobile', async (req, res) => {
  try {
    // Récupérer les ventes de la base de données mobile
    const sales = await mobileDB.query(`
      SELECT 
        id,
        sale_number,
        customer_name,
        total_amount,
        created_at,
        items
      FROM sales 
      WHERE DATE(created_at) = CURDATE()
      ORDER BY created_at DESC
    `);
    
    res.json({
      success: true,
      data: sales,
      count: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.total_amount, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des ventes',
      error: error.message
    });
  }
});

// POST /api/sales/sync
// Synchroniser les ventes vers le système principal
app.post('/api/sales/sync', async (req, res) => {
  try {
    const { sales } = req.body;
    
    // Insérer les ventes dans la base principale
    for (const sale of sales) {
      await mainDB.query(`
        INSERT INTO sales (sale_number, customer_name, total_amount, created_at)
        VALUES (?, ?, ?, ?)
      `, [sale.sale_number, sale.customer_name, sale.total_amount, sale.created_at]);
    }
    
    res.json({ success: true, message: 'Ventes synchronisées avec succès' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la synchronisation',
      error: error.message
    });
  }
});