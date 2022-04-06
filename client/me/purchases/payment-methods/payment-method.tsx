import { Card } from '@automattic/components';
import classNames from 'classnames';
import { isCreditCard } from 'calypso/lib/checkout/payment-methods';
import isJetpackCloud from 'calypso/lib/jetpack/is-jetpack-cloud';
import PaymentMethodBackupToggle from 'calypso/me/purchases/payment-methods/payment-method-backup-toggle';
import PaymentMethodDelete from 'calypso/me/purchases/payment-methods/payment-method-delete';
import PaymentMethodDetails from './payment-method-details';
import type { PaymentMethod as PaymentMethodType } from 'calypso/lib/checkout/payment-methods';

import 'calypso/me/purchases/payment-methods/style.scss';

export default function PaymentMethod( { paymentMethod }: { paymentMethod: PaymentMethodType } ) {
	return (
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
				<PaymentMethodDelete card={ paymentMethod } />
			</div>
		</Card>
	);
}
