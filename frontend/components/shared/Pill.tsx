import { MdClose } from 'react-icons/md';
import classNames from 'classnames';

type PillProps = {
  label: string,
  onRemove: () => void,
  className?: string,
  readOnly?: boolean
}

const Pill = ({ label, onRemove, className, readOnly = false }: PillProps) => (
  <div className={classNames(className, 'pill')}>
    {label}
    {!readOnly &&
			<MdClose onClick={onRemove} className='pill-delete' size={16}/>
    }
  </div>
);

export default Pill;

