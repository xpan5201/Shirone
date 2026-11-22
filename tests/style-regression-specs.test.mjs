import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import {
	EXCLUDED_STYLE_SPECS,
	listStyleRegressionSpecs,
} from "../scripts/ci/list-style-regression-specs.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SITE_TESTS = join(ROOT, "tests", "site");
const WORKFLOW_PATH = join(ROOT, ".github", "workflows", "ci.yml");

test("style runner includes every applicable site spec and excludes local-only suites", () => {
	const discovered = readdirSync(SITE_TESTS)
		.filter((name) => name.endsWith(".spec.ts"))
		.sort();
	const expected = discovered.filter((name) => !EXCLUDED_STYLE_SPECS.has(name));

	assert.deepEqual(listStyleRegressionSpecs(), expected);
	assert.equal(expected.length, discovered.length - EXCLUDED_STYLE_SPECS.size);
	assert.ok(expected.includes("series.spec.ts"));
	assert.ok(expected.includes("taxonomy.spec.ts"));
	assert.ok(!expected.includes("visual.spec.ts"));
	assert.ok(!expected.includes("comments.spec.ts"));
	assert.ok(!expected.includes("waline.spec.ts"));
});

test("workflow runs the focused personal-site smoke and WCAG a11y suite", () => {
	const workflow = parse(readFileSync(WORKFLOW_PATH, "utf8"));
	const smokeJob = workflow.jobs["site-smoke"];
	assert.equal(smokeJob?.name, "Site smoke and a11y");
	const runCmd = smokeJob.steps.at(-1)?.run ?? "";
	const specs = runCmd.match(/tests\/site\/[a-z0-9-]+\.spec\.ts/g) ?? [];
	for (const requiredSpec of [
		"tests/site/a11y.spec.ts",
		"tests/site/site-controls.spec.ts",
		"tests/site/top-app-bar.spec.ts",
		"tests/site/theme-scheme.spec.ts",
		"tests/site/post-list.spec.ts",
		"tests/site/footer.spec.ts",
		"tests/site/layout-stability.spec.ts",
		"tests/site/swup-navigation.spec.ts",
		"tests/site/not-found.spec.ts",
	]) {
		assert.ok(
			specs.includes(requiredSpec),
			`site-smoke job must include ${requiredSpec}`,
		);
	}
	assert.equal(
		new Set(specs).size,
		specs.length,
		"site-smoke job must not list duplicate spec files",
	);
});
