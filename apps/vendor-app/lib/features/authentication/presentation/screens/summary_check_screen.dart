import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/custom_checkbox.dart';
import 'bank_details_screen.dart';
import 'business_documents_screen.dart';
import 'business_information_screen.dart';
import 'store_details_screen.dart';
import 'verification_in_progress_screen.dart';

/// Screen: "Summary check" (Image 8).
class SummaryCheckScreen extends StatefulWidget {
  final String orderId;
  final String orderStatus;
  final String storeName;
  final String category;
  final String address;
  final String hours;
  final String accountHolderName;
  final String accountNumber;
  final String confirmAccountNumber;
  final String ifscCode;

  const SummaryCheckScreen({
    super.key,
    this.orderId = '#FC2822',
    this.orderStatus = 'Delivered',
    this.storeName = 'Balaji Supermart',
    this.category = 'Grocery, Beauty',
    this.address = 'Vijay Nagar, Indore',
    this.hours = 'Open 24×7',
    this.accountHolderName = 'Rakesh Yadav',
    this.accountNumber = '4002 2002 3003 12',
    this.confirmAccountNumber = '0045102003912',
    this.ifscCode = 'HDFC000045',
  });

  @override
  State<SummaryCheckScreen> createState() => _SummaryCheckScreenState();
}

class _SummaryCheckScreenState extends State<SummaryCheckScreen> {
  bool _agreedToTerms = true;
  late String _storeName;
  late String _category;
  late String _address;
  late String _hours;
  late String _accountHolderName;
  late String _accountNumber;
  late String _confirmAccountNumber;
  late String _ifscCode;

  @override
  void initState() {
    super.initState();
    _storeName = widget.storeName;
    _category = widget.category;
    _address = widget.address;
    _hours = widget.hours;
    _accountHolderName = widget.accountHolderName;
    _accountNumber = widget.accountNumber;
    _confirmAccountNumber = widget.confirmAccountNumber;
    _ifscCode = widget.ifscCode;
  }

  Future<void> _editBusiness() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => BusinessInformationScreen(
          isEditing: true,
          initialStoreName: _storeName,
        ),
      ),
    );
    if (result != null && mounted) {
      setState(() {
        if (result['storeName'] != null) {
          _storeName = result['storeName'] as String;
        }
        if (result['category'] != null) {
          _category = result['category'] as String;
        }
      });
    }
  }

  Future<void> _editStore() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => StoreDetailsScreen(
          isEditing: true,
          initialAddress: _address,
          storeName: _storeName,
          category: _category,
        ),
      ),
    );
    if (result != null && mounted) {
      setState(() {
        if (result['address'] != null) {
          _address = result['address'] as String;
        }
        if (result['hours'] != null) {
          _hours = result['hours'] as String;
        }
      });
    }
  }

  Future<void> _editBank() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => BankDetailsScreen(
          isEditing: true,
          storeName: _storeName,
          category: _category,
          address: _address,
          initialAccountHolder: _accountHolderName,
          initialAccountNumber: _accountNumber,
          initialConfirmAccountNumber: _confirmAccountNumber,
          initialIfscCode: _ifscCode,
        ),
      ),
    );
    if (result != null && mounted) {
      setState(() {
        if (result['accountHolderName'] != null) {
          _accountHolderName = result['accountHolderName'] as String;
        }
        if (result['accountNumber'] != null) {
          _accountNumber = result['accountNumber'] as String;
        }
        if (result['confirmAccountNumber'] != null) {
          _confirmAccountNumber = result['confirmAccountNumber'] as String;
        }
        if (result['ifscCode'] != null) {
          _ifscCode = result['ifscCode'] as String;
        }
      });
    }
  }

  Future<void> _editDocuments() async {
    await Navigator.of(context).push<void>(
      MaterialPageRoute(
        builder: (_) => BusinessDocumentsScreen(
          isEditing: true,
          storeName: _storeName,
          category: _category,
          address: _address,
        ),
      ),
    );
  }

  void _onSubmit() {
    if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please agree to Vendor Agreement and Privacy Policy'),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const VerificationInProgressScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16.0),

              // Header: Back Arrow, Title
              Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: const Icon(
                      Icons.arrow_back,
                      size: 24.0,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(width: 14.0),
                  Expanded(
                    child: Text(
                      'Summary check',
                      style: GoogleFonts.inter(
                        fontSize: 22.0,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20.0),

              // Top Order Status Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  horizontal: 18.0,
                  vertical: 16.0,
                ),
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.orderId,
                            style: GoogleFonts.inter(
                              fontSize: 18.0,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4.0),
                          Text(
                            'Today · 6:12 PM · Paid online',
                            style: GoogleFonts.inter(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFFCBD5E1),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12.0),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Order status',
                          style: GoogleFonts.inter(
                            fontSize: 12.0,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF94A3B8),
                          ),
                        ),
                        const SizedBox(height: 2.0),
                        Text(
                          widget.orderStatus,
                          style: GoogleFonts.inter(
                            fontSize: 16.0,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16.0),

              // 1. Business Card
              _buildSummaryCard(
                title: 'Business',
                onEdit: _editBusiness,
                rows: [
                  _SummaryRow(label: 'Shop name', value: _storeName),
                  _SummaryRow(label: 'Category', value: _category),
                ],
              ),
              const SizedBox(height: 14.0),

              // 2. Store Card
              _buildSummaryCard(
                title: 'Store',
                onEdit: _editStore,
                rows: [
                  _SummaryRow(label: 'Address', value: _address),
                  _SummaryRow(label: 'Hours', value: _hours),
                ],
              ),
              const SizedBox(height: 14.0),

              // 3. Bank Card
              _buildSummaryCard(
                title: 'Bank',
                onEdit: _editBank,
                rows: [
                  _SummaryRow(
                    label: 'Account holder name',
                    value: _accountHolderName,
                  ),
                  _SummaryRow(
                    label: 'Account number',
                    value: _accountNumber,
                  ),
                  _SummaryRow(
                    label: 'Confirm account number',
                    value: _confirmAccountNumber,
                  ),
                  _SummaryRow(label: 'IFSC code', value: _ifscCode),
                ],
              ),
              const SizedBox(height: 14.0),

              // 4. Documents Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Documents',
                          style: GoogleFonts.inter(
                            fontSize: 15.0,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF0F172A),
                          ),
                        ),
                        GestureDetector(
                          onTap: _editDocuments,
                          child: Text(
                            'Edit',
                            style: GoogleFonts.inter(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF0F172A),
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14.0),
                    _buildDocumentBadgeRow('Aadhaar', 'Verified', isLime: true),
                    const SizedBox(height: 10.0),
                    _buildDocumentBadgeRow('PAN', 'Uploaded'),
                    const SizedBox(height: 10.0),
                    _buildDocumentBadgeRow('GST', 'Uploaded'),
                    const SizedBox(height: 10.0),
                    _buildDocumentBadgeRow('FSSAI', 'Uploaded'),
                  ],
                ),
              ),
              const SizedBox(height: 18.0),

              // Terms & Conditions Checkbox
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomCheckbox(
                    value: _agreedToTerms,
                    onChanged: (val) => setState(() => _agreedToTerms = val),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    child: RichText(
                      text: TextSpan(
                        style: GoogleFonts.inter(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF0F172A),
                          height: 1.35,
                        ),
                        children: const [
                          TextSpan(text: 'I agree to the '),
                          TextSpan(
                            text: 'Vendor Agreement',
                            style: TextStyle(
                              decoration: TextDecoration.underline,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          TextSpan(text: ' and '),
                          TextSpan(
                            text: 'Privacy Policy.',
                            style: TextStyle(
                              decoration: TextDecoration.underline,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28.0),

              // Submit for verification Button
              SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: _onSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: Text(
                    'Submit for verification',
                    style: GoogleFonts.inter(
                      fontSize: 17.0,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20.0 + paddingBottom),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCard({
    required String title,
    required VoidCallback onEdit,
    required List<_SummaryRow> rows,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 15.0,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              GestureDetector(
                onTap: onEdit,
                child: Text(
                  'Edit',
                  style: GoogleFonts.inter(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF0F172A),
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          for (final row in rows) ...[
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    row.label,
                    style: GoogleFonts.inter(
                      fontSize: 14.0,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    child: Text(
                      row.value,
                      textAlign: TextAlign.end,
                      style: GoogleFonts.inter(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDocumentBadgeRow(
    String name,
    String status, {
    bool isLime = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            name,
            style: GoogleFonts.inter(
              fontSize: 14.0,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF0F172A),
            ),
          ),
        ),
        const SizedBox(width: 12.0),
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 14.0,
            vertical: 5.0,
          ),
          decoration: BoxDecoration(
            color: isLime
                ? const Color(0xFFD4F038)
                : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(14.0),
          ),
          child: Text(
            status,
            style: GoogleFonts.inter(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF0F172A),
            ),
          ),
        ),
      ],
    );
  }
}

class _SummaryRow {
  final String label;
  final String value;
  const _SummaryRow({required this.label, required this.value});
}
