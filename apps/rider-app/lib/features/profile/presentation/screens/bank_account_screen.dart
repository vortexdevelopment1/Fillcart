import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/profile_bloc.dart';
import '../../bloc/profile_event.dart';
import '../../bloc/profile_state.dart';
import '../../models/rider_profile_model.dart';
import '../widgets/profile_theme_constants.dart';

/// Bank Account Screen matching Figma Bank Account & Change/Delete menu screens.
class BankAccountScreen extends StatefulWidget {
  const BankAccountScreen({super.key});

  @override
  State<BankAccountScreen> createState() => _BankAccountScreenState();
}

class _BankAccountScreenState extends State<BankAccountScreen> {
  final TextEditingController _holderController = TextEditingController();
  final TextEditingController _bankNameController = TextEditingController();
  final TextEditingController _ifscController = TextEditingController();
  final TextEditingController _accountNumberController = TextEditingController();

  bool _showSaveButton = false;

  @override
  void dispose() {
    _holderController.dispose();
    _bankNameController.dispose();
    _ifscController.dispose();
    _accountNumberController.dispose();
    super.dispose();
  }

  void _populateForEdit(ProfileBankModel bank) {
    _holderController.text = bank.accountHolderName;
    _bankNameController.text = bank.bankName;
    _ifscController.text = bank.ifscCode;
    _accountNumberController.text = bank.accountNumber;
    setState(() {
      _showSaveButton = true;
    });
  }

  Future<void> _confirmDelete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Delete Bank Account',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 17),
        ),
        content: Text(
          'Are you sure you want to remove your linked bank account?',
          style: GoogleFonts.poppins(
            fontSize: 13,
            color: ProfileTokens.textSecondary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(color: ProfileTokens.textSecondary),
            ),
          ),
          ElevatedButton(
            key: const Key('confirm_delete_bank_button'),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: RiderColors.errorRed,
              foregroundColor: Colors.white,
              minimumSize: const Size(88, 40),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text(
              'Delete',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      context.read<ProfileBloc>().add(const ProfileBankAccountDeleted());
      _holderController.clear();
      _bankNameController.clear();
      _ifscController.clear();
      _accountNumberController.clear();
      setState(() {
        _showSaveButton = true;
      });
    }
  }

  void _saveBankDetails() {
    if (_holderController.text.trim().isEmpty ||
        _bankNameController.text.trim().isEmpty ||
        _ifscController.text.trim().isEmpty ||
        _accountNumberController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Please fill in all bank account fields.',
            style: GoogleFonts.poppins(fontSize: 13),
          ),
          backgroundColor: RiderColors.errorRed,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    context.read<ProfileBloc>().add(
      ProfileBankAccountSaved(
        accountHolderName: _holderController.text,
        bankName: _bankNameController.text,
        ifscCode: _ifscController.text,
        accountNumber: _accountNumberController.text,
      ),
    );

    _holderController.clear();
    _bankNameController.clear();
    _ifscController.clear();
    _accountNumberController.clear();

    setState(() {
      _showSaveButton = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Bank account updated successfully',
          style: GoogleFonts.poppins(fontSize: 13),
        ),
        backgroundColor: ProfileTokens.verifiedGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onFieldChanged(String _) {
    final hasAnyInput =
        _holderController.text.isNotEmpty ||
        _bankNameController.text.isNotEmpty ||
        _ifscController.text.isNotEmpty ||
        _accountNumberController.text.isNotEmpty;
    if (_showSaveButton != hasAnyInput) {
      setState(() => _showSaveButton = hasAnyInput);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('bank_account_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: BlocBuilder<ProfileBloc, ProfileState>(
          builder: (context, state) {
            final bank = state.bankAccount;
            return Column(
              children: [
                ProfileScreenHeader(
                  title: 'Bank Account',
                  trailing: PopupMenuButton<String>(
                    key: const Key('bank_more_menu_button'),
                    icon: const Icon(Icons.more_vert, color: Color(0xFF4B5563)),
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    onSelected: (value) {
                      if (value == 'change') {
                        _populateForEdit(bank);
                      } else if (value == 'delete') {
                        _confirmDelete();
                      }
                    },
                    itemBuilder: (menuContext) => [
                      PopupMenuItem<String>(
                        key: const Key('bank_menu_change'),
                        value: 'change',
                        child: Row(
                          children: [
                            SvgPicture.asset(
                              'assets/svg/edit.svg',
                              width: 18,
                              height: 18,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Change',
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const PopupMenuDivider(height: 1),
                      PopupMenuItem<String>(
                        key: const Key('bank_menu_delete'),
                        value: 'delete',
                        child: Row(
                          children: [
                            SvgPicture.asset(
                              'assets/svg/Delete.svg',
                              width: 18,
                              height: 18,
                              colorFilter: const ColorFilter.mode(
                                Color(0xFFEF4444),
                                BlendMode.srcIn,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Delete',
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFFEF4444),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(16, 6, 16, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _BankHighlightCard(bank: bank),
                        const SizedBox(height: 18),
                        _BankFormField(
                          fieldKey: const Key('bank_holder_name_field'),
                          label: 'Account Holder Name',
                          hint: 'Enter Holder Name',
                          controller: _holderController,
                          onChanged: _onFieldChanged,
                        ),
                        const SizedBox(height: 14),
                        _BankFormField(
                          fieldKey: const Key('bank_name_field'),
                          label: 'Bank Name',
                          hint: 'Enter Bank Name',
                          controller: _bankNameController,
                          onChanged: _onFieldChanged,
                        ),
                        const SizedBox(height: 14),
                        _BankFormField(
                          fieldKey: const Key('bank_ifsc_field'),
                          label: 'IFSC Code',
                          hint: 'Enter IFSC Code',
                          controller: _ifscController,
                          textCapitalization: TextCapitalization.characters,
                          onChanged: _onFieldChanged,
                        ),
                        const SizedBox(height: 14),
                        _BankFormField(
                          fieldKey: const Key('bank_account_number_field'),
                          label: 'Account Number',
                          hint: 'Enter Account Number',
                          controller: _accountNumberController,
                          keyboardType: TextInputType.number,
                          onChanged: _onFieldChanged,
                        ),
                        if (_showSaveButton || !bank.hasLinkedAccount) ...[
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              key: const Key('save_bank_button'),
                              onPressed: _saveBankDetails,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: RiderColors.primaryYellow,
                                foregroundColor: Colors.black,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Text(
                                'Save Bank Details',
                                style: GoogleFonts.poppins(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _BankHighlightCard extends StatelessWidget {
  final ProfileBankModel bank;

  const _BankHighlightCard({required this.bank});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Container(
        key: const Key('bank_highlight_card'),
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(20, 18, 16, 18),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFCBB80A),
              Color(0xFFEBE041),
              Color(0xFFE7DA28),
            ],
          ),
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned(
              right: -14,
              bottom: -24,
              child: Transform.rotate(
                angle: -0.22,
                child: const Opacity(
                  opacity: 0.22,
                  child: Icon(
                    Icons.account_balance,
                    size: 112,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            Row(
              children: [
                Image.asset(
                  'assets/icons/profile_bankicon.png',
                  width: 66,
                  height: 66,
                  fit: BoxFit.contain,
                ),
                const SizedBox(width: 18),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        bank.hasLinkedAccount
                            ? bank.bankName
                            : 'No Bank Account Linked',
                        key: const Key('bank_card_name'),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        bank.hasLinkedAccount
                            ? bank.maskedAccountNumber
                            : 'Add bank details below',
                        key: const Key('bank_card_masked_number'),
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        bank.hasLinkedAccount
                            ? 'IFSC: ${bank.ifscCode}'
                            : 'IFSC: ----',
                        key: const Key('bank_card_ifsc'),
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _BankFormField extends StatelessWidget {
  final Key fieldKey;
  final String label;
  final String hint;
  final TextEditingController controller;
  final TextInputType? keyboardType;
  final TextCapitalization textCapitalization;
  final ValueChanged<String>? onChanged;

  const _BankFormField({
    required this.fieldKey,
    required this.label,
    required this.hint,
    required this.controller,
    this.keyboardType,
    this.textCapitalization = TextCapitalization.none,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 13.5,
            fontWeight: FontWeight.w400,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          key: fieldKey,
          controller: controller,
          keyboardType: keyboardType,
          textCapitalization: textCapitalization,
          onChanged: onChanged,
          style: GoogleFonts.poppins(
            fontSize: 14.5,
            color: Colors.black,
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: GoogleFonts.poppins(
              fontSize: 14.5,
              color: ProfileTokens.textSecondary,
            ),
            filled: true,
            fillColor: ProfileTokens.background,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 14,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: ProfileTokens.fieldBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: ProfileTokens.fieldBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: RiderColors.onSurfaceDark,
                width: 1.5,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
