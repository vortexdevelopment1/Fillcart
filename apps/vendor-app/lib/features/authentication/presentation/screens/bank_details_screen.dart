import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'summary_check_screen.dart';

/// Screen 5/5: "Bank details" (Image 7).
class BankDetailsScreen extends StatefulWidget {
  final String storeName;
  final String ownerName;
  final String address;
  final String city;
  final String pinCode;
  final String category;
  final String subCategory;
  final String panNumber;
  final bool isEditing;
  final String? initialBankName;
  final String? initialAccountHolder;
  final String? initialAccountNumber;
  final String? initialConfirmAccountNumber;
  final String? initialIfscCode;

  const BankDetailsScreen({
    super.key,
    this.storeName = 'Fresh Mart Supermarket',
    this.ownerName = 'Gopal Yadav',
    this.address = 'Vijay Nagar, Indore',
    this.city = 'Indore',
    this.pinCode = '452010',
    this.category = 'Grocery, Beauty',
    this.subCategory = 'Fruits & Vegetables',
    this.panNumber = 'IBKYM02356',
    this.isEditing = false,
    this.initialBankName,
    this.initialAccountHolder,
    this.initialAccountNumber,
    this.initialConfirmAccountNumber,
    this.initialIfscCode,
  });

  @override
  State<BankDetailsScreen> createState() => _BankDetailsScreenState();
}

class _BankDetailsScreenState extends State<BankDetailsScreen> {
  final TextEditingController _bankNameController = TextEditingController();
  final TextEditingController _accountHolderController =
      TextEditingController();
  final TextEditingController _accountNumberController =
      TextEditingController();
  final TextEditingController _confirmAccountController =
      TextEditingController();
  final TextEditingController _ifscController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.initialBankName != null) {
      _bankNameController.text = widget.initialBankName!;
    }
    if (widget.initialAccountHolder != null) {
      _accountHolderController.text = widget.initialAccountHolder!;
    }
    if (widget.initialAccountNumber != null) {
      _accountNumberController.text = widget.initialAccountNumber!;
    }
    if (widget.initialConfirmAccountNumber != null) {
      _confirmAccountController.text = widget.initialConfirmAccountNumber!;
    }
    if (widget.initialIfscCode != null) {
      _ifscController.text = widget.initialIfscCode!;
    }
  }

  @override
  void dispose() {
    _bankNameController.dispose();
    _accountHolderController.dispose();
    _accountNumberController.dispose();
    _confirmAccountController.dispose();
    _ifscController.dispose();
    super.dispose();
  }

  void _onContinue() {
    if (widget.isEditing) {
      Navigator.of(context).pop<Map<String, dynamic>>({
        'bankName': _bankNameController.text.isNotEmpty
            ? _bankNameController.text
            : 'HDFC Bank',
        'accountHolderName': _accountHolderController.text.isNotEmpty
            ? _accountHolderController.text
            : (widget.initialAccountHolder ?? 'Rakesh Yadav'),
        'accountNumber': _accountNumberController.text.isNotEmpty
            ? _accountNumberController.text
            : (widget.initialAccountNumber ?? '4002 2002 3003 12'),
        'confirmAccountNumber': _confirmAccountController.text.isNotEmpty
            ? _confirmAccountController.text
            : (widget.initialConfirmAccountNumber ?? '0045102003912'),
        'ifscCode': _ifscController.text.isNotEmpty
            ? _ifscController.text
            : (widget.initialIfscCode ?? 'HDFC000045'),
      });
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => SummaryCheckScreen(
          storeName: widget.storeName,
          category: widget.category,
          address: widget.address,
          accountHolderName: _accountHolderController.text.isNotEmpty
              ? _accountHolderController.text
              : 'Rakesh Yadav',
          accountNumber: _accountNumberController.text.isNotEmpty
              ? _accountNumberController.text
              : '4002 2002 3003 12',
          confirmAccountNumber: _confirmAccountController.text.isNotEmpty
              ? _confirmAccountController.text
              : '0045102003912',
          ifscCode: _ifscController.text.isNotEmpty
              ? _ifscController.text
              : 'HDFC000045',
        ),
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

              // Header: Back Arrow, Title, Step Indicator 4/5
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
                  Text(
                    'Bank details',
                    style: GoogleFonts.inter(
                      fontSize: 22.0,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '4/5',
                    style: GoogleFonts.inter(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14.0),

              // 5-segment Progress Bar (all 5 active in lime green)
              Row(
                children: List.generate(5, (index) {
                  return Expanded(
                    child: Container(
                      height: 5.5,
                      margin: EdgeInsets.only(right: index < 4 ? 6.0 : 0.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD4F038),
                        borderRadius: BorderRadius.circular(3.0),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 24.0),

              // Bank Name*
              _buildFieldLabel('Bank Name*'),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _bankNameController,
                hintText: 'HDFC',
              ),
              const SizedBox(height: 18.0),

              // Account holder name*
              _buildFieldLabel('Account holder name*'),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _accountHolderController,
                hintText: 'Rakesh Yadav',
              ),
              const SizedBox(height: 18.0),

              // Account Number*
              _buildFieldLabel('Account Number*'),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _accountNumberController,
                hintText: '************',
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 18.0),

              // Confirm account number*
              _buildFieldLabel('Confirm account number*'),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _confirmAccountController,
                hintText: '0045102003912',
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 18.0),

              // IFSC code*
              _buildFieldLabel('IFSC code*'),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _ifscController,
                hintText: 'HDFC000045',
                textCapitalization: TextCapitalization.characters,
              ),
              const SizedBox(height: 36.0),

              // Continue Button
              SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: _onContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: Text(
                    'Continue',
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

  Widget _buildFieldLabel(String text) {
    final hasAsterisk = text.endsWith('*');
    final cleanText = hasAsterisk ? text.substring(0, text.length - 1) : text;

    return RichText(
      text: TextSpan(
        style: GoogleFonts.inter(
          fontSize: 14.5,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF0F172A),
        ),
        children: [
          TextSpan(text: cleanText),
          if (hasAsterisk)
            const TextSpan(
              text: '*',
              style: TextStyle(color: Color(0xFFEF4444)),
            ),
        ],
      ),
    );
  }

  Widget _buildTextInputContainer({
    required TextEditingController controller,
    required String hintText,
    TextInputType? keyboardType,
    TextCapitalization textCapitalization = TextCapitalization.none,
  }) {
    return Container(
      height: 56.0,
      decoration: BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(14.0),
        border: Border.all(
          color: const Color(0xFF71717A),
          width: 1.0,
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      alignment: Alignment.centerLeft,
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        textCapitalization: textCapitalization,
        style: GoogleFonts.inter(
          fontSize: 15.5,
          fontWeight: FontWeight.w400,
          color: const Color(0xFF0F172A),
        ),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: GoogleFonts.inter(
            fontSize: 15.5,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF64748B),
          ),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          disabledBorder: InputBorder.none,
          errorBorder: InputBorder.none,
          focusedErrorBorder: InputBorder.none,
          filled: false,
          fillColor: Colors.transparent,
          isDense: true,
          contentPadding: EdgeInsets.zero,
        ),
      ),
    );
  }
}
