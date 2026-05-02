export default function InputField({ label, name, type = 'text', placeholder, value, onChange, error, icon: Icon, required, autoComplete }) {
  return (
    <div className='auth-field'>
      <label htmlFor={name} className='auth-label'>
        {label} {required && <span className='text-red-400'>*</span>}
      </label>
      <div className='auth-input-wrap'>
        {Icon && <Icon className='auth-input-icon' size={16} />}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={['auth-input', Icon ? 'pl-9' : '', error ? 'error' : ''].join(' ')}
        />
      </div>
      {error && <p className='auth-error-msg'><span>!</span> {error}</p>}
    </div>
  );
}