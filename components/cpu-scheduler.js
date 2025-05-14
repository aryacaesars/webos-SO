"use client"

import { useState, useRef } from "react"
import { ChevronDown, Play, Plus, Trash } from "lucide-react"

export default function CPUScheduler() {
  const [processes, setProcesses] = useState([
    { id: 1, name: "P1", arrivalTime: 0, burstTime: 5, priority: 1 },
    { id: 2, name: "P2", arrivalTime: 1, burstTime: 3, priority: 2 },
    { id: 3, name: "P3", arrivalTime: 2, burstTime: 8, priority: 1 },
    { id: 4, name: "P4", arrivalTime: 3, burstTime: 2, priority: 3 },
  ])
  const [algorithm, setAlgorithm] = useState("fcfs")
  const [quantumTime, setQuantumTime] = useState(2)
  const [ganttChart, setGanttChart] = useState([])
  const [completionTimes, setCompletionTimes] = useState([])
  const [turnaroundTimes, setTurnaroundTimes] = useState([])
  const [waitingTimes, setWaitingTimes] = useState([])
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(0)
  const [averageWaitingTime, setAverageWaitingTime] = useState(0)
  const resultRef = useRef(null)

  const addProcess = () => {
    const newId = processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1
    setProcesses([
      ...processes,
      {
        id: newId,
        name: `P${newId}`,
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
      },
    ])
  }

  const removeProcess = (id) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  const handleProcessChange = (id, field, value) => {
    setProcesses(processes.map((p) => (p.id === id ? { ...p, [field]: Number.parseInt(value) || 0 } : p)))
  }

  const runSimulation = () => {
    let result
    const completionTimes = []
    const turnaroundTimes = []
    const waitingTimes = []

    // Sort processes by arrival time for all algorithms
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)

    switch (algorithm) {
      case "fcfs":
        result = simulateFCFS(sortedProcesses)
        break
      case "sjf":
        result = simulateSJF(sortedProcesses)
        break
      case "priority":
        result = simulatePriority(sortedProcesses)
        break
      case "rr":
        result = simulateRoundRobin(sortedProcesses, quantumTime)
        break
      default:
        result = simulateFCFS(sortedProcesses)
    }

    setGanttChart(result.ganttChart)
    setCompletionTimes(result.completionTimes)
    setTurnaroundTimes(result.turnaroundTimes)
    setWaitingTimes(result.waitingTimes)
    setAverageTurnaroundTime(result.avgTurnaroundTime)
    setAverageWaitingTime(result.avgWaitingTime)
    // Scroll to results after state updates
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const simulateFCFS = (processes) => {
    const ganttChart = []
    const completionTimes = {}
    const turnaroundTimes = {}
    const waitingTimes = {}

    let currentTime = 0

    processes.forEach((process) => {
      // If current time is less than arrival time, CPU is idle
      if (currentTime < process.arrivalTime) {
        ganttChart.push({
          processId: "idle",
          startTime: currentTime,
          endTime: process.arrivalTime,
        })
        currentTime = process.arrivalTime
      }

      // Process execution
      ganttChart.push({
        processId: process.id,
        processName: process.name,
        startTime: currentTime,
        endTime: currentTime + process.burstTime,
      })

      // Update times
      completionTimes[process.id] = currentTime + process.burstTime
      turnaroundTimes[process.id] = completionTimes[process.id] - process.arrivalTime
      waitingTimes[process.id] = turnaroundTimes[process.id] - process.burstTime

      currentTime += process.burstTime
    })

    // Calculate averages
    const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((sum, time) => sum + time, 0) / processes.length
    const avgWaitingTime = Object.values(waitingTimes).reduce((sum, time) => sum + time, 0) / processes.length

    return {
      ganttChart,
      completionTimes,
      turnaroundTimes,
      waitingTimes,
      avgTurnaroundTime,
      avgWaitingTime,
    }
  }

  const simulateSJF = (processes) => {
    const ganttChart = []
    const completionTimes = {}
    const turnaroundTimes = {}
    const waitingTimes = {}

    let currentTime = 0
    const remainingProcesses = [...processes]
    let completed = 0

    // Create a deep copy to track remaining burst time
    const remainingBurstTime = {}
    processes.forEach((process) => {
      remainingBurstTime[process.id] = process.burstTime
    })

    while (completed < processes.length) {
      // Find processes that have arrived by current time
      const availableProcesses = remainingProcesses.filter(
        (p) => p.arrivalTime <= currentTime && remainingBurstTime[p.id] > 0,
      )

      if (availableProcesses.length === 0) {
        // No process available, CPU is idle
        const nextArrival = remainingProcesses.find((p) => remainingBurstTime[p.id] > 0)
        if (nextArrival) {
          ganttChart.push({
            processId: "idle",
            startTime: currentTime,
            endTime: nextArrival.arrivalTime,
          })
          currentTime = nextArrival.arrivalTime
        } else {
          break // All processes completed
        }
      } else {
        // Find the process with shortest burst time
        const shortestJob = availableProcesses.reduce((prev, curr) =>
          remainingBurstTime[prev.id] < remainingBurstTime[curr.id] ? prev : curr,
        )

        // Process execution
        ganttChart.push({
          processId: shortestJob.id,
          processName: shortestJob.name,
          startTime: currentTime,
          endTime: currentTime + remainingBurstTime[shortestJob.id],
        })

        // Update times
        currentTime += remainingBurstTime[shortestJob.id]
        completionTimes[shortestJob.id] = currentTime
        turnaroundTimes[shortestJob.id] = completionTimes[shortestJob.id] - shortestJob.arrivalTime
        waitingTimes[shortestJob.id] = turnaroundTimes[shortestJob.id] - shortestJob.burstTime

        // Mark as completed
        remainingBurstTime[shortestJob.id] = 0
        completed++
      }
    }

    // Calculate averages
    const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((sum, time) => sum + time, 0) / processes.length
    const avgWaitingTime = Object.values(waitingTimes).reduce((sum, time) => sum + time, 0) / processes.length

    return {
      ganttChart,
      completionTimes,
      turnaroundTimes,
      waitingTimes,
      avgTurnaroundTime,
      avgWaitingTime,
    }
  }

  const simulatePriority = (processes) => {
    const ganttChart = []
    const completionTimes = {}
    const turnaroundTimes = {}
    const waitingTimes = {}

    let currentTime = 0
    const remainingProcesses = [...processes]
    let completed = 0

    // Create a deep copy to track remaining burst time
    const remainingBurstTime = {}
    processes.forEach((process) => {
      remainingBurstTime[process.id] = process.burstTime
    })

    while (completed < processes.length) {
      // Find processes that have arrived by current time
      const availableProcesses = remainingProcesses.filter(
        (p) => p.arrivalTime <= currentTime && remainingBurstTime[p.id] > 0,
      )

      if (availableProcesses.length === 0) {
        // No process available, CPU is idle
        const nextArrival = remainingProcesses.find((p) => remainingBurstTime[p.id] > 0)
        if (nextArrival) {
          ganttChart.push({
            processId: "idle",
            startTime: currentTime,
            endTime: nextArrival.arrivalTime,
          })
          currentTime = nextArrival.arrivalTime
        } else {
          break // All processes completed
        }
      } else {
        // Find the process with highest priority (lower number = higher priority)
        const highestPriorityJob = availableProcesses.reduce((prev, curr) =>
          prev.priority < curr.priority ? prev : curr,
        )

        // Process execution
        ganttChart.push({
          processId: highestPriorityJob.id,
          processName: highestPriorityJob.name,
          startTime: currentTime,
          endTime: currentTime + remainingBurstTime[highestPriorityJob.id],
        })

        // Update times
        currentTime += remainingBurstTime[highestPriorityJob.id]
        completionTimes[highestPriorityJob.id] = currentTime
        turnaroundTimes[highestPriorityJob.id] = completionTimes[highestPriorityJob.id] - highestPriorityJob.arrivalTime
        waitingTimes[highestPriorityJob.id] = turnaroundTimes[highestPriorityJob.id] - highestPriorityJob.burstTime

        // Mark as completed
        remainingBurstTime[highestPriorityJob.id] = 0
        completed++
      }
    }

    // Calculate averages
    const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((sum, time) => sum + time, 0) / processes.length
    const avgWaitingTime = Object.values(waitingTimes).reduce((sum, time) => sum + time, 0) / processes.length

    return {
      ganttChart,
      completionTimes,
      turnaroundTimes,
      waitingTimes,
      avgTurnaroundTime,
      avgWaitingTime,
    }
  }

  const simulateRoundRobin = (processes, quantum) => {
    const ganttChart = []
    const completionTimes = {}
    const turnaroundTimes = {}
    const waitingTimes = {}

    let currentTime = 0
    const remainingProcesses = [...processes]

    // Create a deep copy to track remaining burst time
    const remainingBurstTime = {}
    processes.forEach((process) => {
      remainingBurstTime[process.id] = process.burstTime
    })

    // Create a ready queue
    const readyQueue = []
    let i = 0

    // Add first process to ready queue
    if (remainingProcesses.length > 0) {
      readyQueue.push(remainingProcesses[0])
      i++
    }

    while (readyQueue.length > 0) {
      const currentProcess = readyQueue.shift()

      // If process has remaining burst time
      if (remainingBurstTime[currentProcess.id] > 0) {
        // Calculate execution time for this quantum
        const executionTime = Math.min(quantum, remainingBurstTime[currentProcess.id])

        // Process execution
        ganttChart.push({
          processId: currentProcess.id,
          processName: currentProcess.name,
          startTime: currentTime,
          endTime: currentTime + executionTime,
        })

        // Update current time
        currentTime += executionTime

        // Update remaining burst time
        remainingBurstTime[currentProcess.id] -= executionTime

        // Check for new arrivals during this time quantum
        while (i < remainingProcesses.length && remainingProcesses[i].arrivalTime <= currentTime) {
          readyQueue.push(remainingProcesses[i])
          i++
        }

        // If process still has remaining time, add it back to ready queue
        if (remainingBurstTime[currentProcess.id] > 0) {
          readyQueue.push(currentProcess)
        } else {
          // Process completed
          completionTimes[currentProcess.id] = currentTime
          turnaroundTimes[currentProcess.id] = completionTimes[currentProcess.id] - currentProcess.arrivalTime
          waitingTimes[currentProcess.id] = turnaroundTimes[currentProcess.id] - currentProcess.burstTime
        }
      }

      // If ready queue is empty but there are still processes to arrive
      if (readyQueue.length === 0 && i < remainingProcesses.length) {
        // CPU is idle until next arrival
        ganttChart.push({
          processId: "idle",
          startTime: currentTime,
          endTime: remainingProcesses[i].arrivalTime,
        })
        currentTime = remainingProcesses[i].arrivalTime
        readyQueue.push(remainingProcesses[i])
        i++
      }
    }

    // Calculate averages
    const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((sum, time) => sum + time, 0) / processes.length
    const avgWaitingTime = Object.values(waitingTimes).reduce((sum, time) => sum + time, 0) / processes.length

    return {
      ganttChart,
      completionTimes,
      turnaroundTimes,
      waitingTimes,
      avgTurnaroundTime,
      avgWaitingTime,
    }
  }

  // Generate random colors for processes
  const getProcessColor = (processId) => {
    if (processId === "idle") return "#6B7280" // Gray for idle

    // Generate a color based on process ID for consistency
    const colors = [
      "#3B82F6", // Blue
      "#EF4444", // Red
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#06B6D4", // Cyan
      "#F97316", // Orange
    ]

    return colors[(processId - 1) % colors.length]
  }

  return (
    <div className="h-full bg-gray-900 text-white p-4 overflow-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">CPU Scheduling Simulator</h2>

        {/* Algorithm Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Scheduling Algorithm</label>
          <div className="relative">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 appearance-none"
            >
              <option value="fcfs">First-Come, First-Served (FCFS)</option>
              <option value="sjf">Shortest Job First (SJF)</option>
              <option value="priority">Priority Scheduling</option>
              <option value="rr">Round Robin</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        {/* Quantum Time for Round Robin */}
        {algorithm === "rr" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantum Time</label>
            <input
              type="number"
              min="1"
              value={quantumTime}
              onChange={(e) => setQuantumTime(Number.parseInt(e.target.value) || 1)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3"
            />
          </div>
        )}

        {/* Process Table */}
        <div className="mb-4 overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-md">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-4 text-left">Process</th>
                <th className="py-2 px-4 text-left">Arrival Time</th>
                <th className="py-2 px-4 text-left">Burst Time</th>
                {algorithm === "priority" && <th className="py-2 px-4 text-left">Priority</th>}
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{process.name}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      value={process.arrivalTime}
                      onChange={(e) => handleProcessChange(process.id, "arrivalTime", e.target.value)}
                      className="w-16 bg-gray-700 border border-gray-600 rounded-md py-1 px-2"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="1"
                      value={process.burstTime}
                      onChange={(e) => handleProcessChange(process.id, "burstTime", e.target.value)}
                      className="w-16 bg-gray-700 border border-gray-600 rounded-md py-1 px-2"
                    />
                  </td>
                  {algorithm === "priority" && (
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="1"
                        value={process.priority}
                        onChange={(e) => handleProcessChange(process.id, "priority", e.target.value)}
                        className="w-16 bg-gray-700 border border-gray-600 rounded-md py-1 px-2"
                      />
                    </td>
                  )}
                  <td className="py-2 px-4">
                    <button
                      onClick={() => removeProcess(process.id)}
                      className="p-1 bg-red-600 rounded-md hover:bg-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Process Button */}
        <div className="mb-4 flex space-x-2">
          <button onClick={addProcess} className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-md py-2 px-4">
            <Plus className="h-4 w-4 mr-1" />
            Add Process
          </button>

          <button
            onClick={runSimulation}
            className="flex items-center bg-green-600 hover:bg-green-700 rounded-md py-2 px-4"
          >
            <Play className="h-4 w-4 mr-1" />
            Run Simulation
          </button>
        </div>
      </div>

      {/* Results Section */}
      {ganttChart.length > 0 && (
        <div className="mt-8" ref={resultRef}>
          <h3 className="text-lg font-semibold mb-2">Gantt Chart</h3>

          {/* Gantt Chart Visualization */}
          <div className="mb-6">
            <div className="relative h-12 flex">
              {ganttChart.map((segment, index) => {
                const width = `${((segment.endTime - segment.startTime) / ganttChart[ganttChart.length - 1].endTime) * 100}%`
                return (
                  <div
                    key={index}
                    className="h-full flex flex-col justify-between border-r border-gray-700 relative"
                    style={{
                      width,
                      backgroundColor: segment.processId === "idle" ? "#6B7280" : getProcessColor(segment.processId),
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {segment.processId !== "idle" ? segment.processName : "Idle"}
                    </div>
                    <div className="absolute bottom-0 left-0 transform translate-y-full text-xs text-gray-400">
                      {segment.startTime}
                    </div>
                    {index === ganttChart.length - 1 && (
                      <div className="absolute bottom-0 right-0 transform translate-y-full text-xs text-gray-400">
                        {segment.endTime}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Results Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Process Metrics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 border border-gray-700 rounded-md">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-4 text-left">Process</th>
                    <th className="py-2 px-4 text-left">Arrival Time</th>
                    <th className="py-2 px-4 text-left">Burst Time</th>
                    <th className="py-2 px-4 text-left">Completion Time</th>
                    <th className="py-2 px-4 text-left">Turnaround Time</th>
                    <th className="py-2 px-4 text-left">Waiting Time</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process) => (
                    <tr key={process.id} className="border-b border-gray-700">
                      <td className="py-2 px-4">{process.name}</td>
                      <td className="py-2 px-4">{process.arrivalTime}</td>
                      <td className="py-2 px-4">{process.burstTime}</td>
                      <td className="py-2 px-4">{completionTimes[process.id]}</td>
                      <td className="py-2 px-4">{turnaroundTimes[process.id]}</td>
                      <td className="py-2 px-4">{waitingTimes[process.id]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Average Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-400 mb-1">Average Turnaround Time</h4>
              <p className="text-xl font-bold">{averageTurnaroundTime.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-400 mb-1">Average Waiting Time</h4>
              <p className="text-xl font-bold">{averageWaitingTime.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
