import classnames from 'classnames';

export interface GeneratedDesignPickerProps {
	heading?: React.ReactElement;
}

const GeneratedDesignPicker: React.FC< GeneratedDesignPickerProps > = ( { heading } ) => {
	return <div className={ classnames( 'generated-design-picker' ) }>{ heading }</div>;
};

export default GeneratedDesignPicker;
