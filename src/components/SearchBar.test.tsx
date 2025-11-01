import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input with default placeholder', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search for anime...');
    expect(input).toBeInTheDocument();
  });

  it('renders input with custom placeholder', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} placeholder="Custom placeholder" />);

    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('displays the provided value', () => {
    const onChange = vi.fn();
    render(<SearchBar value="naruto" onChange={onChange} />);

    const input = screen.getByDisplayValue('naruto');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search for anime...');
    await user.type(input, 'n');

    expect(onChange).toHaveBeenCalledWith('n');
  });

  it('calls onChange with correct value for each keystroke', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search for anime...');
    await user.type(input, 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
    // userEvent.type emits individual characters
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
    expect(onChange).toHaveBeenNthCalledWith(2, 'b');
    expect(onChange).toHaveBeenNthCalledWith(3, 'c');
  });

  it('does not show clear button when value is empty', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('shows clear button when value is not empty', () => {
    const onChange = vi.fn();
    render(<SearchBar value="naruto" onChange={onChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="naruto" onChange={onChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('hides clear button after clearing', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchBar value="naruto" onChange={onChange} />);

    let clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();

    // Simulate clearing the value
    rerender(<SearchBar value="" onChange={onChange} />);

    clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('has accessible label for clear button', () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
  });

  it('input accepts user typing after clear', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<SearchBar value="test" onChange={onChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    // Simulate the parent component updating the value
    rerender(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search for anime...');
    await user.type(input, 'new');

    // Check that onChange was called for each character
    expect(onChange).toHaveBeenCalledWith('n');
    expect(onChange).toHaveBeenCalledWith('e');
    expect(onChange).toHaveBeenCalledWith('w');
  });

  it('clear button shows for single character', () => {
    const onChange = vi.fn();
    render(<SearchBar value="a" onChange={onChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('handles special characters in input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search for anime...');
    await user.type(input, '!@#$');

    // userEvent.type calls onChange for each character
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('!');
    expect(onChange).toHaveBeenCalledWith('@');
    expect(onChange).toHaveBeenCalledWith('#');
    expect(onChange).toHaveBeenCalledWith('$');
  });

  it('handles spaces in input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('Search for anime...');
    await user.type(input, 'one piece');

    // userEvent.type calls onChange for each character
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.length).toBeGreaterThan(0);
  });
});
