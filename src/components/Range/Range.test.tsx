import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Range } from './Range'

describe('Range — normal mode', () => {
  it('renders min and max currency labels', () => {
    render(<Range mode="normal" min={1} max={100} />)
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
  })

  it('renders two bullet elements', () => {
    render(<Range mode="normal" min={1} max={100} />)
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })

  it('min label input accepts a new value and clamps to [min, maxVal]', async () => {
    render(<Range mode="normal" min={1} max={100} />)
    const minInput = screen.getByDisplayValue('1')
    await userEvent.clear(minInput)
    await userEvent.type(minInput, '50')
    fireEvent.blur(minInput)
    expect(screen.getByDisplayValue('50')).toBeInTheDocument()
  })

  it('clamps min label value to min bound', async () => {
    render(<Range mode="normal" min={1} max={100} />)
    const minInput = screen.getByDisplayValue('1')
    await userEvent.clear(minInput)
    await userEvent.type(minInput, '-5')
    fireEvent.blur(minInput)
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('clamps max label value to max bound', async () => {
    render(<Range mode="normal" min={1} max={100} />)
    const maxInput = screen.getByDisplayValue('100')
    await userEvent.clear(maxInput)
    await userEvent.type(maxInput, '999')
    fireEvent.blur(maxInput)
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
  })

  it('prevents min from exceeding current max bullet value', async () => {
    render(<Range mode="normal" min={1} max={100} />)
    const minInput = screen.getByDisplayValue('1')
    await userEvent.clear(minInput)
    await userEvent.type(minInput, '100')
    fireEvent.blur(minInput)
    // min can't equal or exceed max bullet (which started at 100)
    // should clamp to maxVal - 1 = 99
    expect(screen.getByDisplayValue('99')).toBeInTheDocument()
  })

  it('min bullet position reflects minVal as percentage', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const [minBullet] = screen.getAllByRole('slider')
    // min=0 → left: 0%
    expect(minBullet).toHaveStyle({ left: '0%' })
  })
})

describe('Range — fixed mode', () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  it('renders first and last values as read-only labels', () => {
    render(<Range mode="fixed" values={values} />)
    expect(screen.getByText(/1\.99/)).toBeInTheDocument()
    expect(screen.getByText(/70\.99/)).toBeInTheDocument()
  })

  it('labels are not inputs', () => {
    render(<Range mode="fixed" values={values} />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('renders two bullet elements', () => {
    render(<Range mode="fixed" values={values} />)
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })

  it('min bullet starts at first value position (0%)', () => {
    render(<Range mode="fixed" values={values} />)
    const [minBullet] = screen.getAllByRole('slider')
    expect(minBullet).toHaveStyle({ left: '0%' })
  })

  it('max bullet starts at last value position (100%)', () => {
    render(<Range mode="fixed" values={values} />)
    const [, maxBullet] = screen.getAllByRole('slider')
    expect(maxBullet).toHaveStyle({ left: '100%' })
  })

  it('min bullet aria-valuenow reflects first value', () => {
    render(<Range mode="fixed" values={values} />)
    const [minBullet] = screen.getAllByRole('slider')
    expect(minBullet).toHaveAttribute('aria-valuenow', '1.99')
  })
})
