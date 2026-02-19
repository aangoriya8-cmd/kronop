import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'savings' | 'current' | 'other';
  upiId: string;
  phoneNumber: string;
  email: string;
  panCard: string;
  aadhaarNumber: string;
}

export default function AddBankAccountScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'savings',
    upiId: '',
    phoneNumber: '',
    email: '',
    panCard: '',
    aadhaarNumber: '',
  });

  const [errors, setErrors] = useState<Partial<BankDetails>>({});

  const validateStep1 = () => {
    const newErrors: Partial<BankDetails> = {};

    if (!bankDetails.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!bankDetails.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (bankDetails.accountNumber.length < 9 || bankDetails.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number should be 9-18 digits';
    }

    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!bankDetails.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<BankDetails> = {};

    if (!bankDetails.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!bankDetails.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!bankDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(bankDetails.phoneNumber)) {
      newErrors.phoneNumber = 'Enter valid 10-digit phone number';
    }

    if (bankDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bankDetails.email)) {
      newErrors.email = 'Enter valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Partial<BankDetails> = {};

    if (!bankDetails.panCard.trim()) {
      newErrors.panCard = 'PAN card is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(bankDetails.panCard)) {
      newErrors.panCard = 'Invalid PAN card format';
    }

    if (!bankDetails.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^[0-9]{12}$/.test(bankDetails.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Enter valid 12-digit Aadhaar number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      Alert.alert(
        "Success",
        "Your bank account has been added successfully!",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
      console.log('Bank Details:', bankDetails);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={[styles.step, step >= 1 && styles.activeStep]}>
        <Text style={[styles.stepText, step >= 1 && styles.activeStepText]}>1</Text>
      </View>
      <View style={[styles.stepLine, step >= 2 && styles.activeStepLine]} />
      <View style={[styles.step, step >= 2 && styles.activeStep]}>
        <Text style={[styles.stepText, step >= 2 && styles.activeStepText]}>2</Text>
      </View>
      <View style={[styles.stepLine, step >= 3 && styles.activeStepLine]} />
      <View style={[styles.step, step >= 3 && styles.activeStep]}>
        <Text style={[styles.stepText, step >= 3 && styles.activeStepText]}>3</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Account Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Holder Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.accountHolderName && styles.inputError]}
          placeholder="Enter account holder name"
          placeholderTextColor="#666"
          value={bankDetails.accountHolderName}
          onChangeText={(text) => setBankDetails({...bankDetails, accountHolderName: text})}
        />
        {errors.accountHolderName && <Text style={styles.errorText}>{errors.accountHolderName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.accountNumber && styles.inputError]}
          placeholder="Enter account number"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={bankDetails.accountNumber}
          onChangeText={(text) => setBankDetails({...bankDetails, accountNumber: text})}
        />
        {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Account Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.confirmAccountNumber && styles.inputError]}
          placeholder="Re-enter account number"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={bankDetails.confirmAccountNumber}
          onChangeText={(text) => setBankDetails({...bankDetails, confirmAccountNumber: text})}
        />
        {errors.confirmAccountNumber && <Text style={styles.errorText}>{errors.confirmAccountNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>IFSC Code <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.ifscCode && styles.inputError]}
          placeholder="e.g., SBIN0001234"
          placeholderTextColor="#666"
          autoCapitalize="characters"
          value={bankDetails.ifscCode}
          onChangeText={(text) => setBankDetails({...bankDetails, ifscCode: text.toUpperCase()})}
        />
        {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Bank & Contact Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bank Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.bankName && styles.inputError]}
          placeholder="Enter bank name"
          placeholderTextColor="#666"
          value={bankDetails.bankName}
          onChangeText={(text) => setBankDetails({...bankDetails, bankName: text})}
        />
        {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Branch Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.branchName && styles.inputError]}
          placeholder="Enter branch name"
          placeholderTextColor="#666"
          value={bankDetails.branchName}
          onChangeText={(text) => setBankDetails({...bankDetails, branchName: text})}
        />
        {errors.branchName && <Text style={styles.errorText}>{errors.branchName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => setBankDetails({...bankDetails, accountType: 'savings'})}
          >
            <View style={[styles.radioCircle, bankDetails.accountType === 'savings' && styles.selectedRadio]}>
              {bankDetails.accountType === 'savings' && <View style={styles.selectedRadioInner} />}
            </View>
            <Text style={styles.radioLabel}>Savings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.radioOption}
            onPress={() => setBankDetails({...bankDetails, accountType: 'current'})}
          >
            <View style={[styles.radioCircle, bankDetails.accountType === 'current' && styles.selectedRadio]}>
              {bankDetails.accountType === 'current' && <View style={styles.selectedRadioInner} />}
            </View>
            <Text style={styles.radioLabel}>Current</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>UPI ID (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., name@bank"
          placeholderTextColor="#666"
          value={bankDetails.upiId}
          onChangeText={(text) => setBankDetails({...bankDetails, upiId: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.phoneNumber && styles.inputError]}
          placeholder="Enter 10-digit mobile number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          maxLength={10}
          value={bankDetails.phoneNumber}
          onChangeText={(text) => setBankDetails({...bankDetails, phoneNumber: text})}
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address (Optional)</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter email address"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={bankDetails.email}
          onChangeText={(text) => setBankDetails({...bankDetails, email: text})}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>KYC Documents</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>PAN Card <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.panCard && styles.inputError]}
          placeholder="e.g., ABCDE1234F"
          placeholderTextColor="#666"
          autoCapitalize="characters"
          value={bankDetails.panCard}
          onChangeText={(text) => setBankDetails({...bankDetails, panCard: text.toUpperCase()})}
        />
        {errors.panCard && <Text style={styles.errorText}>{errors.panCard}</Text>}
        <Text style={styles.hintText}>Format: ABCDE1234F</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Aadhaar Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.aadhaarNumber && styles.inputError]}
          placeholder="Enter 12-digit Aadhaar number"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={12}
          value={bankDetails.aadhaarNumber}
          onChangeText={(text) => setBankDetails({...bankDetails, aadhaarNumber: text})}
        />
        {errors.aadhaarNumber && <Text style={styles.errorText}>{errors.aadhaarNumber}</Text>}
      </View>

      <View style={styles.kycNote}>
        <MaterialIcons name="info" size={20} color="#2196F3" />
        <Text style={styles.kycNoteText}>
          Your documents are secure and encrypted. We use them only for verification purposes.
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Review Your Details</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Account Holder:</Text>
          <Text style={styles.summaryValue}>{bankDetails.accountHolderName}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Account Number:</Text>
          <Text style={styles.summaryValue}>XXXX{bankDetails.accountNumber.slice(-4)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>IFSC Code:</Text>
          <Text style={styles.summaryValue}>{bankDetails.ifscCode}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Bank Name:</Text>
          <Text style={styles.summaryValue}>{bankDetails.bankName || '—'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Bank Account</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {step < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit & Verify</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#0A0A0A',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeStep: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeStepText: {
    color: '#fff',
  },
  stepLine: {
    width: 50,
    height: 2,
    backgroundColor: '#1A1A1A',
    marginHorizontal: 8,
  },
  activeStepLine: {
    backgroundColor: '#2196F3',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '500',
  },
  required: {
    color: '#FF5252',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  errorText: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 4,
  },
  hintText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedRadio: {
    borderColor: '#2196F3',
  },
  selectedRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  radioLabel: {
    fontSize: 14,
    color: '#fff',
  },
  kycNote: {
    flexDirection: 'row',
    backgroundColor: '#0A2A4A',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  kycNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    marginLeft: 8,
    lineHeight: 18,
  },
  summaryContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});