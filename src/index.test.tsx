import { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReactClearModal, { ReactClearModalProps } from './index';

// The modal focuses its content (and so receives keyboard events) only after an
// `isOpen` transition: on the very first commit the portal content is not yet
// mounted when the focus effect runs. `renderOpened` mimics real usage by
// mounting closed and then opening.
function renderOpened(props: Partial<ReactClearModalProps>, children: ReactNode) {
  const utils = render(
    <ReactClearModal {...props} isOpen={false}>
      {children}
    </ReactClearModal>
  );

  utils.rerender(
    <ReactClearModal {...props} isOpen>
      {children}
    </ReactClearModal>
  );

  return utils;
}

afterEach(() => {
  document.body.style.overflow = '';
});

describe('ReactClearModal', () => {
  describe('rendering', () => {
    it('renders nothing when closed and preRender is disabled', () => {
      render(
        <ReactClearModal isOpen={false}>
          <p>Modal content</p>
        </ReactClearModal>
      );

      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders children when open', () => {
      render(
        <ReactClearModal isOpen>
          <p>Modal content</p>
        </ReactClearModal>
      );

      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('renders content but keeps the wrapper hidden when preRender is set and modal is closed', () => {
      render(
        <ReactClearModal isOpen={false} preRender>
          <p>Modal content</p>
        </ReactClearModal>
      );

      const content = screen.getByText('Modal content');
      expect(content).toBeInTheDocument();

      const wrapper = content.parentElement?.parentElement as HTMLElement;
      expect(wrapper).toHaveStyle({ display: 'none' });
    });

    it('shows the wrapper with flex display when open', () => {
      render(
        <ReactClearModal isOpen>
          <p>Modal content</p>
        </ReactClearModal>
      );

      const wrapper = screen.getByText('Modal content').parentElement
        ?.parentElement as HTMLElement;
      expect(wrapper).toHaveStyle({ display: 'flex', position: 'fixed' });
    });
  });

  describe('portal rendering', () => {
    it('renders into document.body by default', () => {
      render(
        <ReactClearModal isOpen>
          <p>In body</p>
        </ReactClearModal>
      );

      const content = screen.getByText('In body');
      expect(document.body.contains(content)).toBe(true);
    });

    it('renders into a parent element provided as a selector string', () => {
      const host = document.createElement('div');
      host.id = 'modal-host';
      document.body.appendChild(host);

      render(
        <ReactClearModal isOpen parentElement="#modal-host">
          <p>In host</p>
        </ReactClearModal>
      );

      expect(host).toContainElement(screen.getByText('In host'));
      host.remove();
    });

    it('renders into a parent element provided as an HTMLElement', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);

      render(
        <ReactClearModal isOpen parentElement={host}>
          <p>In element</p>
        </ReactClearModal>
      );

      expect(host).toContainElement(screen.getByText('In element'));
      host.remove();
    });

    it('renders inline (not in a portal) when disableRenderInPortal is set', () => {
      const { container } = render(
        <ReactClearModal isOpen disableRenderInPortal>
          <p>Inline</p>
        </ReactClearModal>
      );

      expect(container).toContainElement(screen.getByText('Inline'));
    });
  });

  describe('closing on background click', () => {
    it('calls onRequestClose when the background is clicked', async () => {
      const user = userEvent.setup();
      const onRequestClose = jest.fn();

      render(
        <ReactClearModal isOpen onRequestClose={onRequestClose}>
          <p>Content</p>
        </ReactClearModal>
      );

      const wrapper = screen.getByText('Content').parentElement
        ?.parentElement as HTMLElement;
      await user.click(wrapper);

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onRequestClose when the content is clicked', async () => {
      const user = userEvent.setup();
      const onRequestClose = jest.fn();

      render(
        <ReactClearModal isOpen onRequestClose={onRequestClose}>
          <button type="button">Inside</button>
        </ReactClearModal>
      );

      await user.click(screen.getByText('Inside'));

      expect(onRequestClose).not.toHaveBeenCalled();
    });

    it('does not call onRequestClose on background click when disableCloseOnBgClick is set', async () => {
      const user = userEvent.setup();
      const onRequestClose = jest.fn();

      render(
        <ReactClearModal
          isOpen
          onRequestClose={onRequestClose}
          disableCloseOnBgClick
        >
          <p>Content</p>
        </ReactClearModal>
      );

      const wrapper = screen.getByText('Content').parentElement
        ?.parentElement as HTMLElement;
      await user.click(wrapper);

      expect(onRequestClose).not.toHaveBeenCalled();
    });

    it('forwards a custom onClick handler on the wrapper', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(
        <ReactClearModal isOpen onClick={onClick}>
          <p>Content</p>
        </ReactClearModal>
      );

      const wrapper = screen.getByText('Content').parentElement
        ?.parentElement as HTMLElement;
      await user.click(wrapper);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('closing on Escape key', () => {
    it('calls onRequestClose when Escape is pressed inside the content', async () => {
      const user = userEvent.setup();
      const onRequestClose = jest.fn();

      renderOpened({ onRequestClose }, <p>Content</p>);

      await user.keyboard('{Escape}');

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onRequestClose on Escape when disableCloseOnEsc is set', async () => {
      const user = userEvent.setup();
      const onRequestClose = jest.fn();

      renderOpened(
        { onRequestClose, disableCloseOnEsc: true },
        <p>Content</p>
      );

      await user.keyboard('{Escape}');

      expect(onRequestClose).not.toHaveBeenCalled();
    });

    it('forwards a custom onKeyDown handler from contentProps', async () => {
      const user = userEvent.setup();
      const onKeyDown = jest.fn();

      renderOpened({ contentProps: { onKeyDown } }, <p>Content</p>);

      await user.keyboard('{Escape}');

      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('focus management', () => {
    it('focuses the content element when opened', () => {
      renderOpened({}, <p>Content</p>);

      const content = screen.getByText('Content').parentElement as HTMLElement;
      expect(content).toHaveFocus();
    });

    it('does not focus the content when disableFocusOnContent is set', () => {
      renderOpened({ disableFocusOnContent: true }, <p>Content</p>);

      const content = screen.getByText('Content').parentElement as HTMLElement;
      expect(content).not.toHaveFocus();
    });
  });

  describe('body scroll locking', () => {
    it('locks body scroll when open and disableBodyScrollOnOpen is set', () => {
      render(
        <ReactClearModal isOpen disableBodyScrollOnOpen>
          <p>Content</p>
        </ReactClearModal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('does not lock body scroll when disableBodyScrollOnOpen is not set', () => {
      render(
        <ReactClearModal isOpen>
          <p>Content</p>
        </ReactClearModal>
      );

      expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('restores body scroll on unmount', () => {
      const { unmount } = render(
        <ReactClearModal isOpen disableBodyScrollOnOpen>
          <p>Content</p>
        </ReactClearModal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).not.toBe('hidden');
    });
  });

  describe('closeTimeout', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('calls onRequestClose after the configured timeout', () => {
      const onRequestClose = jest.fn();

      render(
        <ReactClearModal
          isOpen
          onRequestClose={onRequestClose}
          closeTimeout={1000}
        >
          <p>Content</p>
        </ReactClearModal>
      );

      expect(onRequestClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('clears the timeout on unmount before it fires', () => {
      const onRequestClose = jest.fn();

      const { unmount } = render(
        <ReactClearModal
          isOpen
          onRequestClose={onRequestClose}
          closeTimeout={1000}
        >
          <p>Content</p>
        </ReactClearModal>
      );

      unmount();
      jest.advanceTimersByTime(1000);

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('props forwarding', () => {
    it('merges custom wrapper style with the default style', () => {
      render(
        <ReactClearModal isOpen style={{ backgroundColor: 'rgb(0, 0, 0)' }}>
          <p>Content</p>
        </ReactClearModal>
      );

      const wrapper = screen.getByText('Content').parentElement
        ?.parentElement as HTMLElement;
      expect(wrapper).toHaveStyle({
        backgroundColor: 'rgb(0, 0, 0)',
        position: 'fixed',
      });
    });

    it('passes extra props through to the wrapper element', () => {
      render(
        <ReactClearModal isOpen data-testid="wrapper" className="my-modal">
          <p>Content</p>
        </ReactClearModal>
      );

      const wrapper = screen.getByTestId('wrapper');
      expect(wrapper).toHaveClass('my-modal');
    });

    it('applies contentProps to the content element', () => {
      render(
        <ReactClearModal
          isOpen
          contentProps={{
            className: 'modal-content',
            style: { width: '500px' },
          }}
        >
          <p>Content</p>
        </ReactClearModal>
      );

      const content = screen.getByText('Content').parentElement as HTMLElement;
      expect(content).toHaveClass('modal-content');
      expect(content).toHaveStyle({ width: '500px', margin: 'auto' });
    });
  });
});
