import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  CreditCard,
  DollarSign,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { getTrip, getMembers } from '../api/trips';
import { getExpenses, createExpense, deleteExpense, updateSplitStatus } from '../api/expenses';
import TripMembers from '../components/TripMembers';

export default function TripDetails() {
  const { tripId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);

  // States
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'expenses'

  // Expense/Split related states
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  // API fetches
  const fetchTrip = useCallback(async () => {
    try {
      const data = await getTrip(tripId);
      setTrip(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trip.');
    }
  }, [tripId]);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await getMembers(tripId);
      setMembers(data.data ?? data);
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  }, [tripId]);

  const fetchExpenses = useCallback(async () => {
    setLoadingExpenses(true);
    try {
      const data = await getExpenses(tripId);
      setExpenses(data.data ?? data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoadingExpenses(false);
    }
  }, [tripId]);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      setError('');
      await fetchTrip();
      await fetchMembers();
      await fetchExpenses();
      setLoading(false);
    };
    initFetch();
  }, [fetchTrip, fetchMembers, fetchExpenses]);

  // Tab switching side effects
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'expenses') {
      await fetchExpenses();
      await fetchMembers();
    }
  };

  // Toggle paid status for an individual's split share
  const handleToggleSplitPaid = async (expenseId, userId, currentStatus) => {
    try {
      await updateSplitStatus(tripId, expenseId, userId, !currentStatus);
      // Refresh local expenses state
      await fetchExpenses();
    } catch (err) {
      console.error('Failed to toggle split status:', err);
      alert(err.response?.data?.message || 'Failed to update payment status.');
    }
  };

  // Delete an entire expense
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteExpense(tripId, expenseId);
      await fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert(err.response?.data?.message || 'Failed to delete expense.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground animate-pulse">Loading trip details...</div>
    );
  }

  if (error || !trip) {
    return (
      <div className="space-y-4">
        <Link to="/app/trips" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </Link>
        <div className="border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error || 'Trip could not be loaded.'}
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalTripExpenses = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);

  let youPaid = 0;
  let youOwe = 0;
  let youAreOwed = 0;

  expenses.forEach((exp) => {
    const isPayer = exp.paidById === currentUser?.id;
    if (isPayer) {
      youPaid += parseFloat(exp.amount);
    }

    exp.splits.forEach((split) => {
      const isCurrent = split.userId === currentUser?.id;
      if (isCurrent) {
        // If I am in the split, and I haven't paid the other person yet
        if (!split.isPaid && !isPayer) {
          youOwe += parseFloat(split.amount);
        }
      } else {
        // If others are in the split, and they haven't paid me yet (where I am the payer)
        if (!split.isPaid && isPayer) {
          youAreOwed += parseFloat(split.amount);
        }
      }
    });
  });

  const createdAtDate = trip?.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/app/trips"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </Link>

        <div className="border border-border bg-card p-6 rounded-xl shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{trip.title}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {trip.city}
                </span>
                {createdAtDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {createdAtDate}
                  </span>
                )}
              </div>
              {trip.description && (
                <p className="mt-3 text-sm text-muted-foreground max-w-xl">{trip.description}</p>
              )}
            </div>
            <span className="border border-border bg-muted/50 px-3 py-1 text-sm font-mono font-semibold rounded-md">{trip.baseCurrency}</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview & Members
        </button>
        <button
          onClick={() => handleTabChange('expenses')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'expenses'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Expenses & Splits
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'overview' ? (
        <div className="border border-border bg-card p-6 rounded-xl shadow-xs">
          <TripMembers trip={trip} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Expenses */}
            <div className="border border-border bg-card p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Total Expenses</p>
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3 font-mono">
                {totalTripExpenses.toFixed(2)} <span className="text-xs font-sans font-medium text-muted-foreground">{trip.baseCurrency}</span>
              </p>
            </div>

            {/* You Paid */}
            <div className="border border-border bg-card p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">You Paid</p>
                <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3 font-mono text-green-600">
                {youPaid.toFixed(2)} <span className="text-xs font-sans font-medium text-muted-foreground">{trip.baseCurrency}</span>
              </p>
            </div>

            {/* You Owe */}
            <div className="border border-border bg-card p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">You Owe</p>
                <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <p className={`text-2xl font-bold mt-3 font-mono ${youOwe > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {youOwe.toFixed(2)} <span className="text-xs font-sans font-medium text-muted-foreground">{trip.baseCurrency}</span>
              </p>
            </div>

            {/* You Are Owed */}
            <div className="border border-border bg-card p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">You are Owed</p>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className={`text-2xl font-bold mt-3 font-mono ${youAreOwed > 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {youAreOwed.toFixed(2)} <span className="text-xs font-sans font-medium text-muted-foreground">{trip.baseCurrency}</span>
              </p>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex justify-between items-center gap-4">
            <h3 className="text-lg font-bold tracking-tight">Expense List</h3>
            <CreateExpenseDialog
              trip={trip}
              members={members}
              onExpenseCreated={fetchExpenses}
            />
          </div>

          {/* Expenses List */}
          {loadingExpenses ? (
            <div className="text-center py-10 text-muted-foreground">Refreshing expenses...</div>
          ) : expenses.length === 0 ? (
            <div className="border border-dashed border-border p-12 text-center rounded-xl bg-card">
              <CreditCard className="w-8 h-8 mx-auto text-muted-foreground mb-3 opacity-60" />
              <p className="text-sm font-medium text-foreground">No splits created yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Add your first expense split and divide bills instantly with trip members.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => {
                const isExpanded = expandedExpenseId === expense.id;
                const dateStr = new Date(expense.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                // Find current user's share if present
                const myShare = expense.splits.find((s) => s.userId === currentUser?.id);
                const isPayer = expense.paidById === currentUser?.id;

                // Delete permission check
                const canDelete =
                  expense.createdById === currentUser?.id ||
                  expense.paidById === currentUser?.id ||
                  trip.creatorId === currentUser?.id;

                return (
                  <div key={expense.id} className="border border-border bg-card rounded-xl overflow-hidden shadow-xs hover:border-muted-foreground/30 transition-all">
                    {/* Collapsed Header */}
                    <div
                      onClick={() => setExpandedExpenseId(isExpanded ? null : expense.id)}
                      className="flex items-center justify-between p-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg text-primary uppercase">
                          {expense.title.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base text-foreground leading-snug">{expense.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Paid by <span className="font-medium text-foreground">{isPayer ? 'You' : (expense.paidBy?.name || 'Someone')}</span> • {dateStr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-sm md:text-base font-mono">
                            {parseFloat(expense.amount).toFixed(2)} <span className="text-xs font-sans font-medium text-muted-foreground">{trip.baseCurrency}</span>
                          </p>
                          {myShare && (
                            <p className={`text-xs mt-0.5 ${myShare.isPaid ? 'text-green-600 font-medium' : 'text-destructive font-medium'}`}>
                              {myShare.isPaid ? 'Paid' : `You owe ${parseFloat(myShare.amount).toFixed(2)} ${trip.baseCurrency}`}
                            </p>
                          )}
                        </div>

                        <div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-border bg-muted/10 px-4 py-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Split Breakdown</p>
                          {canDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteExpense(expense.id);
                              }}
                              className="flex items-center gap-1 text-xs text-destructive hover:opacity-85 font-medium transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Expense
                            </button>
                          )}
                        </div>

                        <ul className="divide-y divide-border border border-border bg-card rounded-lg overflow-hidden">
                          {expense.splits.map((split) => {
                            const isSplitSelf = split.userId === currentUser?.id;
                            const isExpensePayer = expense.paidById === currentUser?.id;
                            const isExpenseCreator = expense.createdById === currentUser?.id;

                            // Permission to toggle isPaid
                            const canToggle = isSplitSelf || isExpensePayer || isExpenseCreator;

                            return (
                              <li key={split.userId} className="flex items-center justify-between px-4 py-3 hover:bg-muted/10 transition-colors">
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {isSplitSelf ? 'You' : (split.user?.name || `User ${split.userId}`)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{split.user?.email}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <p className="font-mono text-sm font-semibold">
                                    {parseFloat(split.amount).toFixed(2)} <span className="text-xs font-sans text-muted-foreground">{trip.baseCurrency}</span>
                                  </p>
                                  {canToggle ? (
                                    <button
                                      onClick={() => handleToggleSplitPaid(expense.id, split.userId, split.isPaid)}
                                      className={`text-xs border px-2 py-0.5 rounded-full font-medium transition-all ${
                                        split.isPaid
                                          ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100'
                                          : 'border-amber-400 bg-amber-50 text-amber-600 hover:bg-amber-100'
                                      }`}
                                      title="Click to toggle payment status"
                                    >
                                      {split.isPaid ? 'Paid' : 'Unpaid'}
                                    </button>
                                  ) : (
                                    <span
                                      className={`text-xs border px-2 py-0.5 rounded-full font-medium ${
                                        split.isPaid
                                          ? 'border-green-400 bg-green-50 text-green-700'
                                          : 'border-amber-400 bg-amber-50 text-amber-600'
                                      }`}
                                    >
                                      {split.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sub-component: Create Split Expense Dialog
function CreateExpenseDialog({ trip, members, onExpenseCreated }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state when dialog opens
  useEffect(() => {
    if (open) {
      setTitle('');
      setAmount('');
      setPaidById(currentUser?.id?.toString() || '');
      setSelectedMemberIds(members.map((m) => m.userId));
      setError('');
    }
  }, [open, members, currentUser]);

  // Live calculator calculation
  const totalAmountNum = parseFloat(amount) || 0;
  const activeSplitsCount = selectedMemberIds.length;
  const shareAmount = activeSplitsCount > 0 ? (totalAmountNum / activeSplitsCount) : 0;

  const handleMemberToggle = (userId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMemberIds(members.map((m) => m.userId));
  };

  const handleDeselectAll = () => {
    setSelectedMemberIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a description/title.');
      return;
    }
    if (totalAmountNum <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (selectedMemberIds.length === 0) {
      setError('Please select at least one participant.');
      return;
    }

    setLoading(true);

    try {
      const parsedPayerId = parseInt(paidById);
      const splitPayload = selectedMemberIds.map((userId) => ({
        userId,
        amount: shareAmount,
        // The payer's split is automatically marked as paid
        isPaid: userId === parsedPayerId
      }));

      await createExpense(trip.id, {
        title: title.trim(),
        amount: totalAmountNum,
        paidById: parsedPayerId,
        splits: splitPayload
      });

      setOpen(false);
      onExpenseCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense split.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-85 transition-opacity">
          <Plus className="w-4 h-4" />
          Create Split
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-all" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl focus:outline-none max-h-[85vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold tracking-tight mb-2">Create New Split</Dialog.Title>
          <Dialog.Description className="text-xs text-muted-foreground mb-4">
            Divide bills equally among selected trip members.
          </Dialog.Description>

          {error && (
            <div className="flex items-center gap-2 border border-destructive/30 bg-destructive/5 text-destructive px-3 py-2 text-xs rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="exp-title" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Description / Concept
              </label>
              <input
                id="exp-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flight ticket, Dinner, Fuel"
                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="exp-amount" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Total Amount ({trip.baseCurrency})
              </label>
              <div className="relative">
                <input
                  id="exp-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-border bg-background rounded-lg pl-9 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                  $
                </span>
              </div>
            </div>

            {/* Payer selection */}
            <div>
              <label htmlFor="exp-payer" className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Who Paid?
              </label>
              <select
                id="exp-payer"
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.userId === currentUser?.id ? 'You' : (m.user?.name || `User ${m.userId}`)} ({m.user?.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Participant selector */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Split with:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-[10px] text-muted-foreground">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-[10px] text-muted-foreground font-bold hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="border border-border bg-muted/10 rounded-lg max-h-40 overflow-y-auto divide-y divide-border">
                {members.map((m) => {
                  const isChecked = selectedMemberIds.includes(m.userId);
                  return (
                    <div
                      key={m.userId}
                      onClick={() => handleMemberToggle(m.userId)}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/30 select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-border text-primary focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {m.userId === currentUser?.id ? 'You' : (m.user?.name || `User ${m.userId}`)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{m.user?.email}</p>
                      </div>
                      {isChecked && totalAmountNum > 0 && (
                        <span className="text-xs font-mono font-semibold text-muted-foreground">
                          {shareAmount.toFixed(2)} {trip.baseCurrency}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live split calculator panel */}
            {totalAmountNum > 0 && selectedMemberIds.length > 0 && (
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Split Division Summary</p>
                <p className="text-lg font-bold text-primary font-mono mt-1">
                  {shareAmount.toFixed(2)} <span className="text-xs font-sans text-muted-foreground">{trip.baseCurrency} / person</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Split equally among {selectedMemberIds.length} participant(s).
                </p>
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-85 disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Creating...' : 'Save Split'}
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 py-2 border border-border text-foreground hover:bg-muted rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
