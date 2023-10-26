import useTranslations from '../../hooks/useTranslation';

const SoftwareAttributes = () => {
  const { format } = useTranslations();
  const data = [
    { header: format('table.logo'), value: ['test1'] },
    { header: format('test_table.name.label'), value: ['test2'] },
    { header: format('table.website.label'), value: ['test3'] },
    { header: format('table.documentation.label'), value: ['test4', 'test5'] },
    { header: format('table.point_of_contact'), value: ['test7'] },
  ];

  return (
    <div className="software-attributes-container">
      {data.map((row, indexKey) => (
        <div
          key={`software-attributes-${row.header}-${indexKey}`}
          className="software-attribute"
        >
          <div>
            <p>{row.header}</p>
          </div>
          <div>
            {row.value.map((value, indexKey) => (
              <p key={`software-attributes-value-${indexKey}`}>{value}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoftwareAttributes;
