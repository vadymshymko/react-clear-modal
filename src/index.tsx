/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  HTMLAttributes,
  KeyboardEvent,
  memo,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export type ReactClearModalProps = {
  isOpen?: boolean;
  onRequestClose?: () => void;
  closeTimeout?: number;
  preRender?: boolean;
  contentProps?: HTMLAttributes<HTMLDivElement>;
  children: ReactNode;
  parentElement?: HTMLElement | string;
  disableFocusOnContent?: boolean;
  disableCloseOnEsc?: boolean;
  disableCloseOnBgClick?: boolean;
  disableBodyScrollOnOpen?: boolean;
  disableRenderInPortal?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function ReactClearModal({
  isOpen = false,
  onRequestClose,
  closeTimeout,
  preRender = false,
  contentProps = {},
  children,
  parentElement,
  disableFocusOnContent,
  disableCloseOnEsc,
  disableCloseOnBgClick,
  disableBodyScrollOnOpen,
  disableRenderInPortal,
  ...wrapperProps
}: ReactClearModalProps) {
  const [isReadyForRender, setIsReadyForRender] = useState(
    disableRenderInPortal
  );
  const closeTimeoutRef = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleWrapperClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (wrapperProps.onClick) {
        wrapperProps.onClick(event);
      }

      if (
        onRequestClose &&
        !disableCloseOnBgClick &&
        event.target !== contentRef.current &&
        !contentRef.current?.contains(event.target as Node)
      ) {
        onRequestClose();
      }
    },
    [wrapperProps, onRequestClose, disableCloseOnBgClick]
  );

  const handleContentKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (contentProps.onKeyDown) {
        contentProps.onKeyDown(event);
      }

      if (
        onRequestClose &&
        !disableCloseOnEsc &&
        (event.code === 'Escape' || event.keyCode === 27)
      ) {
        onRequestClose();
      }
    },
    [contentProps, onRequestClose, disableCloseOnEsc]
  );

  const renderContent = useCallback(() => {
    if (!isOpen && !preRender) {
      return null;
    }

    return (
      <div
        {...wrapperProps}
        style={{
          alignItems: 'center',
          bottom: 0,
          display: isOpen ? 'flex' : 'none',
          left: 0,
          overflow: 'auto',
          position: 'fixed',
          right: 0,
          top: 0,
          ...wrapperProps.style,
        }}
        onClick={handleWrapperClick}
      >
        <div
          {...contentProps}
          style={{
            margin: 'auto',
            ...contentProps.style,
          }}
          onKeyDown={handleContentKeyDown}
          tabIndex={-1}
          ref={contentRef}
        >
          {children}
        </div>
      </div>
    );
  }, [
    children,
    contentProps,
    handleContentKeyDown,
    handleWrapperClick,
    isOpen,
    wrapperProps,
    preRender,
  ]);

  useEffect(() => {
    if (closeTimeout && onRequestClose) {
      closeTimeoutRef.current = setTimeout(onRequestClose, closeTimeout);
    }

    return () => {
      clearTimeout(closeTimeoutRef.current);
    };
  }, [closeTimeout, onRequestClose]);

  useEffect(() => {
    if (isOpen && !disableFocusOnContent) {
      contentRef.current?.focus();
    }
  }, [isOpen, disableFocusOnContent]);

  useEffect(() => {
    const initialBodyOverlowStyle = document.body.style.overflow;

    if (isOpen && disableBodyScrollOnOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = initialBodyOverlowStyle;
    };
  }, [isOpen, disableBodyScrollOnOpen]);

  useEffect(() => {
    if (!disableRenderInPortal) {
      setIsReadyForRender(true);
    }
  }, [disableRenderInPortal]);

  if (isReadyForRender) {
    if (disableRenderInPortal) {
      return renderContent();
    }

    const portalContainerDomElement =
      // eslint-disable-next-line no-nested-ternary
      typeof parentElement === 'string'
        ? parentElement
          ? document.querySelector(parentElement)
          : null
        : parentElement;

    return createPortal(
      renderContent(),
      portalContainerDomElement || document.body
    );
  }

  return null;
}

export default memo(ReactClearModal);
