import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { hScale, wScale } from '../utils/styles/dimensions';
import CmsPostPaySvg from '../features/drawer/svgimgcomponents/CmsPostPaySvg';
import CmsPvcSvg from '../features/drawer/svgimgcomponents/CmsPvcSvg';
import CmsPvcSvg2 from '../features/drawer/svgimgcomponents/CmsPvcSvg2';

const PvcCheckPickupstatusModel = ({ visible, onClose, onSave, title }) => {

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={{ alignSelf: 'center' }}>
                        {/* <CmsPostPaySvg /> */}
                        <CmsPvcSvg />

                    </View>


                    <Text style={styles.title}>{"\n"} <Text style={styles.important}>Extremely Important</Text></Text>

                    <Text style={styles.message}>
                        Sorry, you cannot accept new payment from Customer Point without police verification (PVC).
                    </Text>
                    {(title !== 'Go Back') ? <Text style={styles.solutionText}>But this is optional for the customer, you can continue further

                    </Text> : <Text style={styles.solutionText}>Police verification is mandatory. Please do the verification and then try again

                    </Text>
                    }
                    {/* 
                   
                    <Text style={styles.solutionText}>First deposit the amount through any medium and then do the transaction.
                    </Text>
                    <Text style={styles.solutionText}>If the entire amount has already been deposited then call to accounts team, there is some problem, get it resolved first</Text>
                    <Text style={styles.solutionText}>If there is any problem in depositing the money then inform the accounts team</Text> */}
                    {/* <Text style={styles.solutionText}>If there is a bank holiday, permission will be required from the accounts team. */}
                    <Text style={styles.solutionText}>Contact to admin for more details.
                    </Text>

                    <View style={styles.buttonRow}>
                        {title !== 'Go Back' && <TouchableOpacity style={[styles.button, styles.payButton]} onPress={onSave}>
                            <Text style={styles.buttonText}>{title}</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>{'Close'}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default PvcCheckPickupstatusModel;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(20),
        borderRadius: wScale(10),
    },
    title: {

        top:hScale(-10),
        fontSize: wScale(24),
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: wScale(2),
    },
    important: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: wScale(20),
        textTransform: 'uppercase',
        letterSpacing: wScale(0),
    },
    message: {
        color: '#fff',
        fontSize: wScale(18),
        marginVertical: hScale(10),
        textAlign: 'justify',
        fontWeight: 'bold',
    },
    solutionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop: hScale(10),
        marginBottom: hScale(5),
        fontSize: wScale(15),
    },
    solutionText: {
        color: '#fff',
        fontSize: wScale(15),
        marginBottom: hScale(5),
        textAlign: 'justify',
    },
    button: {
        marginTop: hScale(15),
        backgroundColor: '#ffff66',
        padding: hScale(12),
        borderRadius: wScale(5),
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: wScale(14),
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hScale(20),
    },

    payButton: {
        backgroundColor: '#ffff66',
        flex: 1,
        marginRight: wScale(10),
    },

    closeButton: {
        backgroundColor: '#ccc',
        flex: 1,
    },

});

