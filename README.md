# react-clear-modal

[![npm version](https://img.shields.io/npm/v/react-clear-modal)](https://www.npmjs.com/package/react-clear-modal@latest)
[![minified + gzip](https://img.shields.io/bundlephobia/minzip/react-clear-modal/latest)](https://bundlephobia.com/package/react-clear-modal@latest)
[![typescript](https://badgen.net/npm/types/react-clear-modal)](https://unpkg.com/react-clear-modal/dist/index.d.ts)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vadymshymko/react-clear-modal/blob/master/LICENSE)

Simple and lightweight, fully controlled isomorphic (with SSR support) modal component for React.js

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Demo](#demo)

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
      <button type="button" title="Open" onClick={openModal}>Open</button>

      <ReactClearModal
        {/* here you can also pass any other element attributes. */}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id beatae quia, neque modi libero quidem ipsum architecto, incidunt molestias culpa, totam accusantium reprehenderit animi voluptas magni alias error commodi ut.
        </div>

        <button type="button" title="Close" onClick={closeModal}>Close</button>
      </ReactClearModal>
    </div>
  );
}

export default ReactClearModalExample;
```

## Props

| Name                        | Type                    | Default Value   | Description                                                                                                                                                                                                    |
| --------------------------- | ----------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **isOpen**                  | `boolean`               | `false`         | Is the modal open                                                                                                                                                                                              |
| **onRequestClose**          | `function`              |                 | The function that will be called to close the modal window when the ESC button is pressed (if `disableCloseOnEsc` !== true) or an area outside of the content is clicked (if `disableCloseOnBgClick` !== true) |
| **closeTimeout**            | `number`                |                 | Time period in milliseconds after which the modal close function (`onRequestClose` prop) will be called                                                                                                        |
| **preRender**               | `boolean`               | `false`         | Whether the modal window and its content must be present in the DOM when the `isOpen` property is set to `false`                                                                                               |
| **contentProps**            | `object`                | `{}`            | DOM props (HTMLAttributes) for modal content wrapper div                                                                                                                                                       |
| **parentElement**           | `string`\|`HTMLElement` | `document.body` | Modal Portal container element (`HTMLElement`) or css selector (`string`). Ignored if `disableRenderInPortal` is set to `true`                                                                                 |
| **disableCloseOnEsc**       | `boolean`               | `false`         | Prevent modal window from closing when `ESC` key is pressed                                                                                                                                                    |
| **disableCloseOnBgClick**   | `boolean`               | `false`         | Prevent modal from closing after clicking on modal background                                                                                                                                                  |
| **disableBodyScrollOnOpen** | `boolean`               | `false`         | Set `{overflow: hidden}` for `document.body` when modal is open                                                                                                                                                |
| **disableRenderInPortal**   | `boolean`               | `false`         | Prevent render modal in portal (if `true` it will be rendered directly inside parent component)                                                                                                                |
| ...                         | `object`                | `{}`            | DOM props (HTMLAttributes) for modal container div                                                                                                                                                             |

## Demo

[![Edit react-clear-modal](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-clear-modal-qdpb48)
