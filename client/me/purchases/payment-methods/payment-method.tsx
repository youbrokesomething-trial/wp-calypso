import { Card, Button } from '@automattic/components';
import classNames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import { isCreditCard } from 'calypso/lib/checkout/payment-methods';
import isJetpackCloud from 'calypso/lib/jetpack/is-jetpack-cloud';
import PaymentMethodBackupToggle from 'calypso/me/purchases/payment-methods/payment-method-backup-toggle';
import PaymentMethodDelete from 'calypso/me/purchases/payment-methods/payment-method-delete';
import PaymentMethodDetails from './payment-method-details';
import type { PaymentMethod as PaymentMethodType } from 'calypso/lib/checkout/payment-methods';

import 'calypso/me/purchases/payment-methods/style.scss';

export default function PaymentMethod( { paymentMethod }: { paymentMethod: PaymentMethodType } ) {
	const [ isEditing, setIsEditing ] = useState( false );
	const translate = useTranslate();
	return (
		<div>
			<Card
				className={ classNames( 'payment-method__wrapper', {
					'payment-method__wrapper--jetpack-cloud': isJetpackCloud(),
				} ) }
			>
				<div className="payment-method">
					<PaymentMethodDetails
						lastDigits={ paymentMethod.card }
						email={ paymentMethod.email }
						cardType={ paymentMethod.card_type || '' }
						paymentPartner={ paymentMethod.payment_partner }
						name={ paymentMethod.name }
						expiry={ paymentMethod.expiry }
						isExpired={ paymentMethod.is_expired }
					/>
					{ isCreditCard( paymentMethod ) && <PaymentMethodBackupToggle card={ paymentMethod } /> }
					<Button onClick={ () => setIsEditing( ( prev ) => ! prev ) }>
						{ translate( 'Edit' ) }
					</Button>
				</div>
			</Card>
			{ isEditing && (
				<Card>
					<div className="payment-method__edit-payment-method">
						<PaymentMethodDelete card={ paymentMethod } />
					</div>
				</Card>
			) }
		</div>
	);
}
