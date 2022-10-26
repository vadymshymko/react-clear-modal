# react-clear-modal

[![npm version](https://img.shields.io/npm/v/react-clear-modal)](https://www.npmjs.com/package/react-clear-modal)
[![minified + gzip](https://img.shields.io/bundlephobia/minzip/react-clear-modal/latest)](https://bundlephobia.com/package/react-clear-modal)
[![typescript](https://badgen.net/npm/types/react-clear-modal)](https://unpkg.com/react-clear-modal/dist/index.d.ts)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vadymshymko/react-clear-modal/blob/master/LICENSE)

Simple and lightweight modal component for React.js

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

## Installation

**npm**

```bash
npm install react-clear-modal --save
```

**yarn**

```bash
yarn add react-clear-modal
```

## Usage

#### Basic Example:

```js
import { useState } from 'react';
import ReactClearModal from 'react-clear-modal';

function ReactClearModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal =  useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div>
      <ReactClearModal
        {/* here you can also pass any other element attributes. */}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id beatae quia, neque modi libero quidem ipsum architecto, incidunt molestias culpa, totam accusantium reprehenderit animi voluptas magni alias error commodi ut.
        <div>

        <button type="button" title="Close" onClick={closeModal}>Close</button>
      </ReactClearModal>
    </div>
  );
}

export default ReactClearModalExample;
```

## Props

| Name                        | Type       | Default Value | Description                                                                                                      |
| --------------------------- | ---------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **isOpen**                  | `boolean`  | `false`       | Is the modal open                                                                                                |
| **onRequestClose**          | `function` |               | Callback to handle the request to close the modal                                                                |
| **closeTimeout**            | `number`   |               | Time period in milliseconds after which the modal close function (`onRequestClose` prop) will be called          |
| **preRender**               | `boolean`  | `false`       | Whether the modal window and its content must be present in the DOM when the `isOpen` property is set to `false` |
| **contentProps**            | `object`   | `{}`          | DOM props (HTMLAttributes) for modal content wrapper div                                                         |
| **disableCloseOnEsc**       | `boolean`  | `false`       | Prevent modal window from closing when `ESC` key is pressed                                                      |
| **disableCloseOnBgClick**   | `boolean`  | `false`       | Prevent modal from closing after clicking on modal background                                                    |
| **disableBodyScrollOnOpen** | `boolean`  | `false`       | Set `{overflow: hidden}` for `document.body` when modal is open                                                  |
