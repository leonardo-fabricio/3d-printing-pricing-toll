import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatBRL } from '../../services/formatters'

interface TotalsCardProps {
  material: number
  energy: number
  wear: number
  extras: number
  cost_total: number
  profit_brl: number
  final_price: number
  profit_percent: number
}

function AnimatedValue({ value }: { value: number }) {
  return (
    <motion.span
      key={value.toFixed(2)}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {formatBRL(value)}
    </motion.span>
  )
}

export function TotalsCard({ material, energy, wear, extras, cost_total, profit_brl, final_price, profit_percent }: TotalsCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <h3 className="text-xs font-semibold text-fg-subtle uppercase tracking-wider mb-3">Composição de Custos</h3>
        <div className="space-y-2">
          {[
            { label: 'Material', value: material },
            { label: 'Energia', value: energy },
            { label: 'Desgaste', value: wear },
            { label: 'Extras', value: extras },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-fg-muted">{row.label}</span>
              <span className="text-fg tabular-nums"><AnimatedValue value={row.value} /></span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
            <span className="text-fg-muted">Custo total</span>
            <span className="text-fg tabular-nums"><AnimatedValue value={cost_total} /></span>
          </div>
        </div>
      </Card>

      <Card className="border-brand-500/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
            <DollarSign size={14} className="text-brand-400" />
          </div>
          <h3 className="text-sm font-semibold text-fg">Precificação</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-green-400" />
              <span className="text-xs text-fg-muted">Lucro ({profit_percent}%)</span>
            </div>
            <span className="text-sm text-green-400 font-medium tabular-nums"><AnimatedValue value={profit_brl} /></span>
          </div>

          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-0.5">
              <ShoppingCart size={12} className="text-brand-400" />
              <span className="text-xs text-brand-400 font-medium">Preço de Venda</span>
            </div>
            <span className="text-2xl font-bold text-fg tabular-nums"><AnimatedValue value={final_price} /></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
