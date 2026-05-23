import { cn } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { Filter, Model, Msg, Todo } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const App: React.FC<Props> = ({ model, dispatch }) => {
  const totalCount = model.todos.length
  const completedCount = model.todos.filter((t) => t.completed).length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const filteredTodos = model.todos.filter((todo) => {
    if (model.filter === 'Active') return !todo.completed
    if (model.filter === 'Completed') return todo.completed
    return true
  })

  return (
    <div className="w-full h-dvh flex flex-col bg-slate-950 text-slate-100 safe-top safe-bottom overflow-hidden">
      {/* Top Header Card */}
      <div className="pt-4 pb-5 px-6 bg-gradient-to-b from-indigo-900/20 to-slate-950/0 border-b border-slate-900/60 flex flex-col shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Tea-Cup Tasker
            </h1>
            <p className="text-xs text-slate-400">Pure Functional State</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-950 border border-indigo-500/20 text-indigo-300 rounded-full">
            Capacitor
          </span>
        </div>

        {/* Progress Card */}
        <div className="p-4 rounded-2xl glass-panel relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1 z-10">
            <h3 className="text-sm font-medium text-slate-200">Daily Completion</h3>
            <p className="text-xs text-slate-400">
              {completedCount} of {totalCount} task{totalCount === 1 ? '' : 's'} completed
            </p>
          </div>
          {/* Progress circle info */}
          <div className="relative flex items-center justify-center z-10">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-violet-500 transition-all duration-500 ease-out"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-slate-200">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {O.isSome(model.errorMsg) && (
        <div className="mx-6 my-2 p-3 bg-red-950/60 border border-red-500/20 rounded-xl flex items-center justify-between animate-fade-in shrink-0">
          <div className="flex items-center space-x-2 text-red-400 text-xs">
            <AlertCircle size={14} className="shrink-0" />
            <span>{model.errorMsg.value}</span>
          </div>
          <button
            onClick={() => dispatch({ _tag: 'DismissError' })}
            className="text-red-400 hover:text-red-300"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Scrollable Todo List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-none">
        {filteredTodos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500 space-y-2">
            <span className="text-3xl">☕</span>
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs max-w-[200px]">Add tasks or switch filters to inspect other states</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "p-4 rounded-2xl flex items-center justify-between border transition-all duration-300",
                todo.completed
                  ? "bg-slate-900/30 border-slate-900/60 opacity-60"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700/60"
              )}
            >
              <div
                onClick={() => dispatch({ _tag: 'ToggleTodo', id: todo.id })}
                className="flex items-center space-x-3 flex-1 cursor-pointer select-none"
              >
                <button className="text-slate-400 focus:outline-none">
                  {todo.completed ? (
                    <CheckCircle2 size={20} className="text-violet-400 fill-violet-400/10" />
                  ) : (
                    <Circle size={20} className="hover:text-slate-200 transition-colors" />
                  )}
                </button>
                <span
                  className={cn(
                    "text-sm font-medium transition-all duration-300 break-all pr-2",
                    todo.completed ? "line-through text-slate-500 font-normal" : "text-slate-200"
                  )}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => dispatch({ _tag: 'DeleteTodo', id: todo.id })}
                className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-800/40 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Action controls & Input Panel */}
      <div className="p-6 bg-slate-950 border-t border-slate-900 flex flex-col shrink-0 space-y-4">
        
        {/* Quick Info & Clear Completed */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{model.todos.filter((t) => !t.completed).length} items remaining</span>
          {model.todos.some((t) => t.completed) && (
            <button
              onClick={() => dispatch({ _tag: 'ClearCompleted' })}
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Add Todo input field */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ _tag: 'AddTodo' })
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={model.inputText}
            onChange={(e) => dispatch({ _tag: 'ChangeInputText', text: e.target.value })}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 rounded-2xl text-sm placeholder-slate-500 text-slate-100 outline-none transition-all"
          />
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-100 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none"
          >
            <Plus size={18} />
          </button>
        </form>

        {/* Navigation/Filter Tabs */}
        <div className="flex bg-slate-900/60 border border-slate-900 rounded-2xl p-1 justify-between select-none">
          {(['All', 'Active', 'Completed'] as Filter[]).map((tab) => {
            const active = model.filter === tab
            return (
              <button
                key={tab}
                onClick={() => dispatch({ _tag: 'ChangeFilter', filter: tab })}
                className={cn(
                  "flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 outline-none",
                  active
                    ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-violet-300 border border-violet-500/10 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
