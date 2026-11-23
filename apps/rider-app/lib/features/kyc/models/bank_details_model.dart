import 'package:equatable/equatable.dart';

/// Immutable model representing Bank details in KYC Step 4/4 (Figma 1848:51788).
///
/// Contains the 5 mandatory bank fields with approved copy:
/// - Account Holder Name
/// - Bank Name
/// - IFSC Code
/// - Account Number
/// - Confirm Account Number
class BankDetailsModel extends Equatable {
  final String accountHolderName;
  final String bankName;
  final String ifscCode;
  final String accountNumber;
  final String confirmAccountNumber;

  const BankDetailsModel({
    this.accountHolderName = '',
    this.bankName = '',
    this.ifscCode = '',
    this.accountNumber = '',
    this.confirmAccountNumber = '',
  });

  bool get isAccountNumberMatching =>
      accountNumber.trim().isNotEmpty &&
      accountNumber.trim() == confirmAccountNumber.trim();

  bool get isComplete =>
      accountHolderName.trim().isNotEmpty &&
      bankName.trim().isNotEmpty &&
      ifscCode.trim().isNotEmpty &&
      accountNumber.trim().isNotEmpty &&
      isAccountNumberMatching;

  BankDetailsModel copyWith({
    String? accountHolderName,
    String? bankName,
    String? ifscCode,
    String? accountNumber,
    String? confirmAccountNumber,
  }) {
    return BankDetailsModel(
      accountHolderName: accountHolderName ?? this.accountHolderName,
      bankName: bankName ?? this.bankName,
      ifscCode: ifscCode ?? this.ifscCode,
      accountNumber: accountNumber ?? this.accountNumber,
      confirmAccountNumber: confirmAccountNumber ?? this.confirmAccountNumber,
    );
  }

  @override
  List<Object?> get props => [
    accountHolderName,
    bankName,
    ifscCode,
    accountNumber,
    confirmAccountNumber,
  ];
}
