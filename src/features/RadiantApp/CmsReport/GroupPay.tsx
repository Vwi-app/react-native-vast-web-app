import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
} from 'react-native'
import React, { useState } from 'react'
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond'
import { hScale, wScale } from '../../../utils/styles/dimensions'
import FlotingInput from '../../drawer/securityPages/FlotingInput'
import DynamicButton from '../../drawer/button/DynamicButton'
import { useRoute } from '@react-navigation/native'

const paymentOptions = [
    'Barer Cash Deposit',
    'Client Cash Deposit',
    'Online Transfer',
    'Wallet Transfer',
]

const GroupPay = () => {
 


    const [totalAmount, setTotalAmount] = useState('₹15,000')
    // const [amount, setAmount] = useState('')
    const [paymentType, setPaymentType] = useState(paymentOptions[0])
    const [modalVisible, setModalVisible] = useState(false)

    const handleDropdownSelect = (value) => {
        setPaymentType(value)
        setModalVisible(false)
    }

    return (
        <View style={styles.main}>
            <AppBarSecond title={'Group Pay'} />
            <View style={styles.container}>
                <Text style={styles.label}>Total Amount</Text>
                <FlotingInput
                    label={'Total Amount'}

                    value={totalAmount}
                    editable={false}
                />

                <FlotingInput
                    value={amount}
                    // onChangeText={setAmount}
                    keyboardType="numeric"
                    label="Enter amount"
                />

                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                >
                    <FlotingInput
                        label={'Select Mode'}

                        value={paymentType}
                        editable={false}
                    />
                </TouchableOpacity>
                <FlotingInput
                    label={'Radiant Account'}

                    value={''}
                    editable={false}
                />
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <FlotingInput
                        label={'Upload Slip'}
                        editable={false}
                    />

                </TouchableOpacity>

                <DynamicButton title={'Submit'} />
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={paymentOptions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => handleDropdownSelect(item)}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default GroupPay

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#fff' },
    container: {
        padding: wScale(16),
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 6,
        marginTop: 6,
    },
    readonly: {
        backgroundColor: '#f2f2f2',
        color: '#555',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginTop: 6,
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        elevation: 5,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
})
