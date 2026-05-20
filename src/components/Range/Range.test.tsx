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
