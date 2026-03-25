"""
DEEVO Cortex - Rules Evaluator
Rule evaluation and execution engine
"""

from datetime import datetime
from typing import List, Dict, Any, Optional, Union
from collections import defaultdict

from ...models import (
    Rule, RuleSet, RuleCategory, Operator, LogicalOperator, ActionType,
    Condition, ConditionGroup, RuleAction,
    RuleEvaluationResult, RuleSetEvaluationResult,
    Signal
)


class RulesEvaluator:
    """
    Evaluates rules against signal data and executes actions.
    """

    def __init__(self):
        self._execution_log: List[Dict[str, Any]] = []

    def evaluate_ruleset(
        self, 
        ruleset: RuleSet, 
        context: Dict[str, Any]
    ) -> RuleSetEvaluationResult:
        """
        Evaluate all rules in a ruleset against the given context.
        Context should contain signal values keyed by signal ID or name.
        """
        results: List[RuleEvaluationResult] = []
        total_risk = 0.0
        rules_triggered = 0
        
        # Sort rules by priority (higher priority first)
        sorted_rules = sorted(
            [r for r in ruleset.rules if r.enabled],
            key=lambda r: r.priority or 50,
            reverse=True
        )
        
        for rule in sorted_rules:
            result = self.evaluate_rule(rule, context)
            results.append(result)
            
            if result.triggered:
                rules_triggered += 1
                total_risk += result.risk_contribution
        
        # Cap total risk at 1.0
        total_risk = min(total_risk, 1.0)
        
        return RuleSetEvaluationResult(
            ruleset_id=ruleset.ruleset_id,
            timestamp=datetime.utcnow(),
            rules_evaluated=len(sorted_rules),
            rules_triggered=rules_triggered,
            total_risk=total_risk,
            results=results
        )

    def evaluate_rule(
        self, 
        rule: Rule, 
        context: Dict[str, Any]
    ) -> RuleEvaluationResult:
        """
        Evaluate a single rule against the context.
        """
        conditions_met: List[str] = []
        conditions_failed: List[str] = []
        
        # Evaluate condition group
        triggered = self._evaluate_condition_group(
            rule.conditions, 
            context,
            conditions_met,
            conditions_failed
        )
        
        # Execute actions if triggered
        actions_executed: List[ActionType] = []
        if triggered:
            for action in rule.actions:
                self._execute_action(action, context)
                actions_executed.append(action.type)
        
        return RuleEvaluationResult(
            rule_id=rule.id,
            triggered=triggered,
            conditions_met=conditions_met,
            conditions_failed=conditions_failed,
            risk_contribution=rule.risk_contribution or 0.0 if triggered else 0.0,
            actions_executed=actions_executed
        )

    def _evaluate_condition_group(
        self,
        group: ConditionGroup,
        context: Dict[str, Any],
        met: List[str],
        failed: List[str]
    ) -> bool:
        """
        Recursively evaluate a condition group.
        """
        results: List[bool] = []
        
        for condition in group.conditions:
            if isinstance(condition, ConditionGroup):
                result = self._evaluate_condition_group(condition, context, met, failed)
            else:
                result = self._evaluate_condition(condition, context)
                condition_str = f"{condition.field} {condition.operator.value} {condition.value}"
                if result:
                    met.append(condition_str)
                else:
                    failed.append(condition_str)
            
            results.append(result)
        
        # Apply logical operator
        if group.operator == LogicalOperator.AND:
            return all(results)
        elif group.operator == LogicalOperator.OR:
            return any(results)
        elif group.operator == LogicalOperator.NOT:
            return not results[0] if results else True
        elif group.operator == LogicalOperator.XOR:
            return sum(results) == 1
        
        return False

    def _evaluate_condition(
        self, 
        condition: Condition, 
        context: Dict[str, Any]
    ) -> bool:
        """
        Evaluate a single condition.
        """
        field_value = context.get(condition.field)
        
        if field_value is None:
            return False
        
        target_value = condition.value
        
        try:
            if condition.operator == Operator.GT:
                return float(field_value) > float(target_value)
            
            elif condition.operator == Operator.GTE:
                return float(field_value) >= float(target_value)
            
            elif condition.operator == Operator.LT:
                return float(field_value) < float(target_value)
            
            elif condition.operator == Operator.LTE:
                return float(field_value) <= float(target_value)
            
            elif condition.operator == Operator.EQ:
                return field_value == target_value
            
            elif condition.operator == Operator.NEQ:
                return field_value != target_value
            
            elif condition.operator == Operator.BETWEEN:
                return float(target_value) <= float(field_value) <= float(condition.value_end or target_value)
            
            elif condition.operator == Operator.IN:
                return field_value in (target_value if isinstance(target_value, list) else [target_value])
            
            elif condition.operator == Operator.NOT_IN:
                return field_value not in (target_value if isinstance(target_value, list) else [target_value])
        
        except (ValueError, TypeError):
            return False
        
        return False

    def _execute_action(
        self, 
        action: RuleAction, 
        context: Dict[str, Any]
    ) -> None:
        """
        Execute a rule action.
        """
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "action_type": action.type.value,
            "params": action.params,
            "context_snapshot": {k: v for k, v in context.items() if not k.startswith("_")}
        }
        
        self._execution_log.append(log_entry)
        
        # Action handlers would be implemented here
        # For now, we just log the action
        if action.type == ActionType.SET_RISK:
            context["_risk_override"] = action.params.get("value", 0) if action.params else 0
        
        elif action.type == ActionType.FLAG:
            flags = context.get("_flags", [])
            flags.append(action.params.get("flag_type", "GENERAL") if action.params else "GENERAL")
            context["_flags"] = flags

    def get_execution_log(self) -> List[Dict[str, Any]]:
        """Return the execution log."""
        return self._execution_log

    def clear_execution_log(self) -> None:
        """Clear the execution log."""
        self._execution_log = []


# Pre-built rule templates for common scenarios
class RuleTemplates:
    """
    Factory for common rule patterns.
    """

    @staticmethod
    def high_inflation_rule(threshold: float = 5.0) -> Rule:
        return Rule(
            id="RULE-INF-0001",
            name="High Inflation Alert",
            description="Triggers when inflation exceeds threshold",
            category=RuleCategory.RISK_THRESHOLD,
            priority=80,
            conditions=ConditionGroup(
                operator=LogicalOperator.AND,
                conditions=[
                    Condition(field="inflation", operator=Operator.GT, value=threshold)
                ]
            ),
            actions=[
                RuleAction(type=ActionType.FLAG, params={"flag_type": "HIGH_INFLATION"}),
                RuleAction(type=ActionType.SET_RISK, params={"value": 0.3})
            ],
            risk_contribution=0.3
        )

    @staticmethod
    def fraud_detection_rule(threshold: float = 0.4) -> Rule:
        return Rule(
            id="RULE-FRD-0001",
            name="Fraud Risk Detection",
            description="Triggers when fraud indicators exceed threshold",
            category=RuleCategory.FRAUD_DETECTION,
            priority=95,
            conditions=ConditionGroup(
                operator=LogicalOperator.OR,
                conditions=[
                    Condition(field="fraud_index", operator=Operator.GT, value=threshold),
                    ConditionGroup(
                        operator=LogicalOperator.AND,
                        conditions=[
                            Condition(field="claims_rate", operator=Operator.GT, value=0.7),
                            Condition(field="loss_ratio", operator=Operator.GT, value=0.8)
                        ]
                    )
                ]
            ),
            actions=[
                RuleAction(type=ActionType.ESCALATE, params={"level": "URGENT"}),
                RuleAction(type=ActionType.FLAG, params={"flag_type": "FRAUD_RISK"})
            ],
            risk_contribution=0.5
        )

    @staticmethod
    def claims_stress_rule() -> Rule:
        return Rule(
            id="RULE-CLM-0001",
            name="Claims Stress Indicator",
            description="Monitors claims rate for stress conditions",
            category=RuleCategory.CLAIMS_TRIGGER,
            priority=70,
            conditions=ConditionGroup(
                operator=LogicalOperator.AND,
                conditions=[
                    Condition(field="claims_rate", operator=Operator.GT, value=0.5),
                    Condition(field="loss_ratio", operator=Operator.GT, value=0.65)
                ]
            ),
            actions=[
                RuleAction(type=ActionType.REVIEW, params={"review_type": "CLAIMS_AUDIT"}),
                RuleAction(type=ActionType.SET_RISK, params={"value": 0.25})
            ],
            risk_contribution=0.25
        )
