import React from "react";

import {
  RadioProps,
  Radio,
  Text,
  Breadcrumbs,
  Anchor,
  useMantineTheme,
} from "@mantine/core";

import { useStyles } from "../../styles/components/pageHeader.style";

interface Props {
  title?: string;
  label?: string;
  radioOptions?: any;
  handleRadioChange?: any;
  activeFilter?: string | number;
  breadcrumbs?: any;
}

const PageHeader: React.FC<Props> = ({
  title,
  label,
  radioOptions,
  handleRadioChange,
  activeFilter,
  breadcrumbs = [],
}) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const itemsForBreadcrumbs = breadcrumbs.map((item: any, index: number) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <div>
      <Text size="xl" weight="bold" color="gray">
        {title}
      </Text>
      {label && (
        <Text size="xs" weight="normal" color={theme.colors.gray[6]}>
          {label}
        </Text>
      )}

      {radioOptions && (
        <div className={classes.radioWrapper}>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            {radioOptions.length > 0 &&
              radioOptions.map((opt: any, index: number) => {
                return (
                  <Radio
                    key={index}
                    checked={index === activeFilter ? true : false}
                    value={opt.value}
                    label={opt.label}
                    size="xs"
                    color="blue"
                    onChange={(value) => {
                      handleRadioChange(value, index);
                    }}
                    style={{
                      marginLeft: index !== 0 ? 12 : 0,
                    }}
                  />
                );
              })}
          </div>
        </div>
      )}

      {breadcrumbs && (
        <div className={classes.breadcrumbWrapper}>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <Breadcrumbs>{itemsForBreadcrumbs}</Breadcrumbs>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
