import 'package:flutter/material.dart';

class PrescriptionsScreen extends StatefulWidget {
  const PrescriptionsScreen({super.key});

  @override
  State<PrescriptionsScreen> createState() => _PrescriptionsScreenState();
}

class _PrescriptionsScreenState extends State<PrescriptionsScreen> {
  String _statusFilter = 'All';

  final List<Map<String, dynamic>> _prescriptions = [
    {
      'id': 'RX-2024-001',
      'patientName': 'John Doe',
      'doctorName': 'Dr. Sarah Smith',
      'medicines': ['Amoxicillin 500mg', 'Paracetamol 1g'],
      'date': '2024-02-05',
      'status': 'Pending',
      'urgency': 'Normal',
    },
    {
      'id': 'RX-2024-002',
      'patientName': 'Jane Wilson',
      'doctorName': 'Dr. Michael Brown',
      'medicines': ['Ibuprofen 400mg'],
      'date': '2024-02-05',
      'status': 'Completed',
      'urgency': 'Normal',
    },
    {
      'id': 'RX-2024-003',
      'patientName': 'Robert Johnson',
      'doctorName': 'Dr. Emily Davis',
      'medicines': ['Aspirin 500mg', 'Cetirizine 10mg'],
      'date': '2024-02-04',
      'status': 'In Progress',
      'urgency': 'Urgent',
    },
    {
      'id': 'RX-2024-004',
      'patientName': 'Maria Garcia',
      'doctorName': 'Dr. James Wilson',
      'medicines': ['Amoxicillin 250mg'],
      'date': '2024-02-04',
      'status': 'Pending',
      'urgency': 'Normal',
    },
  ];

  List<Map<String, dynamic>> get _filteredPrescriptions {
    if (_statusFilter == 'All') return _prescriptions;
    return _prescriptions
        .where((rx) => rx['status'] == _statusFilter)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Prescriptions'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
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
                _StatusChip('In Progress', _statusFilter == 'In Progress'),
                _StatusChip('Completed', _statusFilter == 'Completed'),
              ],
            ),
          ),

          // Prescriptions List
          Expanded(
            child: _filteredPrescriptions.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.receipt_long,
                            size: 64, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        Text(
                          'No prescriptions found',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _filteredPrescriptions.length,
                    itemBuilder: (context, index) {
                      final prescription = _filteredPrescriptions[index];
                      return _PrescriptionCard(
                        prescription: prescription,
                        onTap: () => _showPrescriptionDetails(prescription),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddPrescriptionDialog(),
        icon: const Icon(Icons.add),
        label: const Text('New Prescription'),
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

  void _showPrescriptionDetails(Map<String, dynamic> prescription) {
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
                          prescription['id'],
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      _StatusBadge(prescription['status']),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _DetailSection(
                    title: 'Patient Information',
                    items: [
                      _InfoItem(
                        icon: Icons.person,
                        label: 'Patient',
                        value: prescription['patientName'],
                      ),
                      _InfoItem(
                        icon: Icons.medical_services,
                        label: 'Doctor',
                        value: prescription['doctorName'],
                      ),
                      _InfoItem(
                        icon: Icons.calendar_today,
                        label: 'Date',
                        value: prescription['date'],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _DetailSection(
                    title: 'Prescribed Medicines',
                    items: (prescription['medicines'] as List<String>)
                        .map((med) => _MedicineItem(medicine: med))
                        .toList(),
                  ),
                  const SizedBox(height: 24),
                  if (prescription['status'] == 'Pending')
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Processing prescription...'),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF00796B),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      child: const Text('Process Prescription'),
                    ),
                  if (prescription['status'] == 'In Progress')
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Prescription completed!'),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      child: const Text('Mark as Completed'),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showAddPrescriptionDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add New Prescription'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Prescription ID',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Patient Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Doctor Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Medicines (comma separated)',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
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
                const SnackBar(
                    content: Text('Prescription added successfully!')),
              );
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
}

class _PrescriptionCard extends StatelessWidget {
  final Map<String, dynamic> prescription;
  final VoidCallback onTap;

  const _PrescriptionCard({
    required this.prescription,
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
                          prescription['id'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          prescription['patientName'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  _StatusBadge(prescription['status']),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.medical_services,
                      size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      prescription['doctorName'],
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ),
                  if (prescription['urgency'] == 'Urgent')
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'URGENT',
                        style: TextStyle(
                          color: Colors.red,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${(prescription['medicines'] as List).length} medicine(s)',
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
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
      case 'In Progress':
        return Colors.blue;
      case 'Completed':
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

class _DetailSection extends StatelessWidget {
  final String title;
  final List<Widget> items;

  const _DetailSection({
    required this.title,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...items,
      ],
    );
  }
}

class _InfoItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoItem({
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
                    fontSize: 14,
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

class _MedicineItem extends StatelessWidget {
  final String medicine;

  const _MedicineItem({required this.medicine});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          const Icon(Icons.medication, size: 20, color: Color(0xFF00796B)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              medicine,
              style: const TextStyle(fontSize: 14),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.info_outline, size: 20),
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}
