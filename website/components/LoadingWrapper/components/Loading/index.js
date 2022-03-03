/* eslint-disable react/forbid-prop-types */
import React from 'react';
import Lottie from 'react-lottie';

import { getOptions } from './constants';
import styles from './styles.module.scss';

function Loading({
  marginClassName,
  className,
  height = 124.5,
  width = 150,
  type,
  loop,
  autoplay,
  rendererSettings,
  color
}) {
  return (
    <div
      className={`row center middle ${styles.spinnerContainer} ${
        marginClassName || styles.defaultMargin
      } ${className}`}
    >
      <Lottie
        width={width}
        height={height}
        options={getOptions({ type, loop, autoplay, rendererSettings, color })}
      />
    </div>
  );
}

export default Loading;
