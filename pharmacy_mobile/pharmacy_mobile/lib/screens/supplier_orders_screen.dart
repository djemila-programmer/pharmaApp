import 'package:flutter/material.dart';

class SupplierOrdersScreen extends StatefulWidget {
  const SupplierOrdersScreen({super.key});

  @override
  State<SupplierOrdersScreen> createState() => _SupplierOrdersScreenState();
}

class _SupplierOrdersScreenState extends State<SupplierOrdersScreen> {
  String _statusFilter = 'All';

  final List<Map<String, dynamic>> _orders = [
    {
      'id': 'PO-2024-001',
      'supplier': 'PharmaCorp',
      'date': '2024-02-03',
      'items': ['Aspirin 500mg', 'Amoxicillin 250mg'],
      'total': 1250.00,
      'status': 'Pending',
    },
    {
      'id': 'PO-2024-002',
      'supplier': 'MediSupply',
      'date': '2024-02-01',
      'items': ['Ibuprofen 400mg', 'Cetirizine 10mg'],
      'total': 890.50,
      'status': 'Delivered',
    },
    {
      'id': 'PO-2024-003',
      'supplier': 'HealthPlus',
      'date': '2024-01-30',
      'items': ['Paracetamol 1g'],
      'total': 450.00,
      'status': 'In Transit',
    },
  ];

  final List<Map<String, String>> _suppliers = [
    {'name': 'PharmaCorp', 'contact': '+1 234 567 890'},
    {'name': 'MediSupply', 'contact': '+1 345 678 901'},
    {'name': 'HealthPlus', 'contact': '+1 456 789 012'},
  ];

  List<Map<String, dynamic>> get _filteredOrders {
    if (_statusFilter == 'All') return _orders;
    return _orders.where((order) => order['status'] == _statusFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Supplier Orders'),
        actions: [
          IconButton(
            icon: const Icon(Icons.contacts),
            onPressed: () => _showSuppliersDialog(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Status Filter
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _StatusChip('All', _statusFilter == 'All'),
                _StatusChip('Pending', _statusFilter == 'Pending'),
                _StatusChip('In Transit', _statusFilter == 'In Transit'),
                _StatusChip('Delivered', _statusFilter == 'Delivered'),
              ],
            ),
          ),

          // Orders List
          Expanded(
            child: _filteredOrders.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.local_shipping,
                            size: 64, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        const Text(
                          'No orders found',
                          style: TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filteredOrders.length,
                    itemBuilder: (context, index) {
                      final order = _filteredOrders[index];
                      return _OrderCard(
                        order: order,
                        onTap: () => _showOrderDetails(order),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showNewOrderDialog(),
        icon: const Icon(Icons.add),
        label: const Text('New Order'),
      ),
    );
  }

  Widget _StatusChip(String label, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          setState(() => _statusFilter = label);
        },
        selectedColor: const Color(0xFF00796B).withOpacity(0.3),
      ),
    );
  }

  void _showSuppliersDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Suppliers'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: _suppliers
              .map(
                (supplier) => ListTile(
                  leading: const CircleAvatar(
                    child: Icon(Icons.business),
                  ),
                  title: Text(supplier['name']!),
                  subtitle: Text(supplier['contact']!),
                  trailing: IconButton(
                    icon: const Icon(Icons.phone),
                    onPressed: () {},
                  ),
                ),
              )
              .toList(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showOrderDetails(Map<String, dynamic> order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) {
          return SingleChildScrollView(
            controller: scrollController,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          order['id'],
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      _StatusBadge(order['status']),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _DetailRow(
                    icon: Icons.business,
                    label: 'Supplier',
                    value: order['supplier'],
                  ),
                  _DetailRow(
                    icon: Icons.calendar_today,
                    label: 'Order Date',
                    value: order['date'],
                  ),
                  _DetailRow(
                    icon: Icons.attach_money,
                    label: 'Total Amount',
                    value: '\$${order['total'].toStringAsFixed(2)}',
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Items',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...(order['items'] as List<String>).map(
                    (item) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Row(
                        children: [
                          const Icon(Icons.medication,
                              size: 20, color: Color(0xFF00796B)),
                          const SizedBox(width: 12),
                          Expanded(child: Text(item)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  if (order['status'] == 'Pending')
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text('Order cancelled')),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.red,
                            ),
                            child: const Text('Cancel Order'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF00796B),
                              foregroundColor: Colors.white,
                            ),
                            child: const Text('Track Order'),
                          ),
                        ),
                      ],
                    ),
                  if (order['status'] == 'Delivered')
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.check_circle),
                      label: const Text('Confirm Receipt'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 50),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showNewOrderDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Create New Order'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  labelText: 'Select Supplier',
                  border: OutlineInputBorder(),
                ),
                items: _suppliers
                    .map((s) => DropdownMenuItem(
                          value: s['name'],
                          child: Text(s['name']!),
                        ))
                    .toList(),
                onChanged: (value) {},
              ),
              const SizedBox(height: 12),
              const TextField(
                decoration: InputDecoration(
                  labelText: 'Order Items (comma separated)',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 12),
              const TextField(
                decoration: InputDecoration(
                  labelText: 'Total Amount',
                  border: OutlineInputBorder(),
                  prefixText: '\$',
                ),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Order created successfully!')),
              );
            },
            child: const Text('Create Order'),
          ),
        ],
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Map<String, dynamic> order;
  final VoidCallback onTap;

  const _OrderCard({
    required this.order,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          order['id'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          order['supplier'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  _StatusBadge(order['status']),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    order['date'],
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  const Spacer(),
                  Text(
                    '\$${order['total'].toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF00796B),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;

  const _StatusBadge(this.status);

  Color _getColor() {
    switch (status) {
      case 'Pending':
        return Colors.orange;
      case 'In Transit':
        return Colors.blue;
      case 'Delivered':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _getColor().withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: _getColor(),
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: const Color(0xFF00796B)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
