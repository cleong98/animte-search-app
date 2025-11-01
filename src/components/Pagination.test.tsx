import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

// Mock the useBreakpoint hook
vi.mock('../hooks/useWindowSize', () => ({
  useBreakpoint: vi.fn(() => ({ isMobile: false })),
}));

describe('Pagination', () => {
  it('does not render when totalPages is 1', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('does not render when totalPages is less than 1', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={onPageChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders Previous and Next buttons', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={10} onPageChange={onPageChange} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('enables Previous button when not on first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={10} onPageChange={onPageChange} />);

    const previousButton = screen.getByText('Previous');
    expect(previousButton).not.toBeDisabled();
  });

  it('disables Next button on last page', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={onPageChange}
        hasNextPage={false}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables Next button when not on last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with previous page when Previous is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    const previousButton = screen.getByText('Previous');
    await user.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with next page when Next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it('highlights current page button', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);

    const currentPageButton = screen.getByRole('button', { name: '3' });
    expect(currentPageButton).toHaveClass('btn-primary');
  });

  it('shows page numbers for small total pages', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('shows limited page numbers for large total pages', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={100} onPageChange={onPageChange} />);

    // Should show max 5 page numbers
    const pageButtons = screen.getAllByRole('button').filter((button) => {
      const text = button.textContent || '';
      return /^\d+$/.test(text);
    });

    expect(pageButtons.length).toBeLessThanOrEqual(5);
  });

  it('calls onPageChange when page number button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const page3Button = screen.getByRole('button', { name: '3' });
    await user.click(page3Button);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders jump to page input', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const jumpInput = screen.getByPlaceholderText('Page');
    expect(jumpInput).toBeInTheDocument();
    expect(jumpInput).toHaveAttribute('type', 'number');
  });

  it('renders Go button for jump to page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const goButtons = screen.getAllByText('Go');
    expect(goButtons.length).toBeGreaterThan(0);
  });

  it('calls onPageChange when jump to valid page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const jumpInput = screen.getByPlaceholderText('Page');
    const goButton = screen.getAllByText('Go')[0];

    await user.type(jumpInput, '7');
    await user.click(goButton);

    expect(onPageChange).toHaveBeenCalledWith(7);
  });

  it('clears jump input after successful jump', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const jumpInput = screen.getByPlaceholderText('Page') as HTMLInputElement;
    const goButton = screen.getAllByText('Go')[0];

    await user.type(jumpInput, '5');
    await user.click(goButton);

    expect(jumpInput.value).toBe('');
  });

  it('does not call onPageChange for invalid jump page (too low)', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    const jumpInput = screen.getByPlaceholderText('Page');
    const goButton = screen.getAllByText('Go')[0];

    await user.type(jumpInput, '0');
    await user.click(goButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange for invalid jump page (too high)', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    const jumpInput = screen.getByPlaceholderText('Page');
    const goButton = screen.getAllByText('Go')[0];

    await user.type(jumpInput, '11');
    await user.click(goButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('handles Enter key press in jump input', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const jumpInput = screen.getByPlaceholderText('Page');

    await user.type(jumpInput, '8');
    await user.keyboard('{Enter}');

    expect(onPageChange).toHaveBeenCalledWith(8);
  });

  it('does not call onPageChange when Previous clicked on first page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    const previousButton = screen.getByText('Previous');
    await user.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when Next clicked on last page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={onPageChange}
        hasNextPage={false}
      />
    );

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('respects hasNextPage prop', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={onPageChange}
        hasNextPage={false}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });
});
